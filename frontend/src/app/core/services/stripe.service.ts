import {inject, Injectable} from '@angular/core';
import {loadStripe, Stripe, StripeElements, StripeElementsOptions, StripeElementsOptionsMode} from '@stripe/stripe-js';
import { Observable, from } from 'rxjs';
import {environment} from '../../environments/environment';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private readonly stripe: Promise<Stripe | null>;
  private readonly apiService = inject(ApiService)

  constructor() {
    this.stripe = loadStripe(environment.stripePublishableKey);
  }

  getStripe(): Promise<Stripe | null> {
    return this.stripe;
  }

  async createElements(options: StripeElementsOptionsMode): Promise<StripeElements | null> {
    const stripe = await this.stripe;
    if (!stripe) {
      console.error('Stripe not initialized');
      return null;
    }
    return stripe.elements(options);
  }


  createPaymentIntent(amount: number, currency: string, endpoint: string): Observable<any> {
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Amount must be a positive number');
    }

    return this.apiService.postRequest(endpoint, {
      amount,
      currency
    });
  }

  createCustomer(email: string, name: string): Observable<any> {
    return this.apiService.postRequest(`/create-customer`, {
      email,
      name
    });
  }

  async confirmPayment(paymentIntentClientSecret: string, paymentMethodId: string): Promise<any> {
    const stripe = await this.getStripe();
    if (!stripe) throw new Error('Stripe not initialized');

    return stripe.confirmCardPayment(paymentIntentClientSecret, {
      payment_method: paymentMethodId
    });
  }
}
