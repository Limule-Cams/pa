import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private readonly stripe: Stripe | null = null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!apiKey) {
      this.logger.warn('STRIPE_SECRET_KEY not found. Stripe disabled.');
      return;
    }
    try {
      const apiVersion = '2025-03-31.basil';
      this.stripe = new Stripe(apiKey, { apiVersion: apiVersion });
      this.logger.log('Stripe Service Initialized successfully.');
    } catch (error) {
      this.logger.error('Failed to initialize Stripe SDK:', error.message);
      this.stripe = null;
    }
  }

  isAvailable(): boolean {
    return this.stripe !== null;
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'eur',
    metadata?: Record<string, string>, // Make optional
    customerId?: string,
  ): Promise<{ clientSecret: string; id: string }> {
    if (!this.isAvailable()) {
      throw new InternalServerErrorException('Payment service unavailable.');
    }

    // Validate metadata structure
    if (metadata) {
      for (const [key, value] of Object.entries(metadata)) {
        if (typeof value !== 'string') {
          throw new BadRequestException(
            `Metadata value for ${key} must be a string`,
          );
        }
      }
    }

    const client = this.stripe!;
    this.logger.log(
      `Creating Stripe Payment Intent for ${amount} ${currency}...`,
    );

    try {
      const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
        amount: Math.round(amount),
        currency: currency,
        metadata: metadata || {}, // Ensure metadata is always an object
      };

      if (customerId) {
        paymentIntentParams.customer = customerId;
      }

      const paymentIntent =
        await client.paymentIntents.create(paymentIntentParams);

      if (!paymentIntent.client_secret) {
        throw new InternalServerErrorException('Stripe client_secret missing.');
      }

      this.logger.log(`Created PaymentIntent: ${paymentIntent.id}`);
      return {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
      };
    } catch (error) {
      this.logger.error(
        `Stripe Payment Intent creation failed: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(`Stripe Error: ${error.message}`);
    }
  }

  async retrievePaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    if (!this.isAvailable())
      throw new InternalServerErrorException('Payment service unavailable.');
    const client = this.stripe!;
    this.logger.log(`Retrieving Stripe Payment Intent ${paymentIntentId}`);
    try {
      const paymentIntent =
        await client.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      this.logger.error(
        `Stripe Payment Intent retrieval failed: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(`Stripe Error: ${error.message}`);
    }
  }

  async findOrCreateCustomer(
    email: string,
    name: string,
    metadata?: Stripe.MetadataParam,
  ): Promise<Stripe.Customer> {
    if (!this.isAvailable())
      throw new InternalServerErrorException('Payment service unavailable.');
    const client = this.stripe!;
    try {
      const existingCustomers = await client.customers.list({
        email: email,
        limit: 1,
      });
      if (existingCustomers.data.length > 0) {
        this.logger.log(
          `Found existing Stripe customer for ${email}: ${existingCustomers.data[0].id}`,
        );
        return existingCustomers.data[0];
      } else {
        this.logger.log(`Creating new Stripe customer for ${email}`);
        const customer = await client.customers.create({
          email: email,
          name: name,
          metadata: metadata,
        });
        return customer;
      }
    } catch (error) {
      this.logger.error(
        `Failed to find/create Stripe customer for ${email}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(`Stripe Error: ${error.message}`);
    }
  }
}