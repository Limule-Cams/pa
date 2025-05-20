import {Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Stripe, StripeCardElement, StripeElements} from '@stripe/stripe-js';
import {StripeService} from '../../../core/services/stripe.service';
import {NgIf} from '@angular/common';
import {ApiService} from '../../../core/services/api.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payement.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./payement.component.scss']
})
export class StripePaymentComponent implements OnInit {
  @ViewChild('cardElement') cardElement!: ElementRef;
  @Input() quoteData: any;

  private readonly apiService = inject(ApiService);

  paymentForm: FormGroup;
  loading = false;
  paymentError: string | null = null;
  paymentSuccess = false;

  stripe!: Stripe | null;
  elements!: StripeElements | null;
  card!: StripeCardElement | null;

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.quoteData = navigation?.extras.state?.['quoteData'];

    this.paymentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async ngOnInit() {
    this.stripe = await this.stripeService.getStripe();
  }

  async ngAfterViewInit() {
    if (!this.cardElement) return;
    this.elements = await this.stripeService.createElements({
      mode: 'payment',
      amount: this.quoteData.totalAmount,
      currency: 'eur',
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#5A4A7B',
        }
      }
    });

    if (this.elements) {
      this.card = this.elements.create('card', {
        hidePostalCode: true,
        style: {
          base: {
            fontSize: '16px',
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            '::placeholder': {
              color: '#aab7c4'
            }
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
          }
        }
      });

      this.card.mount(this.cardElement.nativeElement);
      this.card.on('change', (event) => {
        this.paymentError = event.error ? event.error.message : null;
      });
    }
  }

  async processPayment() {
    if (!this.paymentForm.valid || !this.card || !this.stripe) {
      return;
    }

    if (!this.quoteData || typeof this.quoteData.totalAmount !== 'number') {
      this.paymentError = 'Invalid quote data';
      return;
    }

    this.loading = true;
    this.paymentError = null;

    const {name, email} = this.paymentForm.value;

    try {
      const amountInCents = Math.round(this.quoteData.totalAmount * 100);

      if (isNaN(amountInCents) || amountInCents <= 0) {
        throw new Error('Invalid payment amount');
      }

      const paymentIntentResponse = await this.stripeService.createPaymentIntent(
        amountInCents,
        'eur',
        'company/create-payement-intent'
      ).toPromise();

      if (!paymentIntentResponse?.clientSecret) {
        throw new Error('Missing client secret from server');
      }

      const {error, paymentIntent} = await this.stripe.confirmCardPayment(
        paymentIntentResponse.clientSecret,
        {
          payment_method: {
            card: this.card,
            billing_details: {
              name,
              email
            }
          },
          receipt_email: email
        }
      );

      if (error) {
        this.paymentError = error.message || 'Payment failed';
      } else if (paymentIntent?.status === 'succeeded') {
        this.paymentSuccess = true;
        setTimeout(() => {
          this.router.navigate(['/companies/dashboard'], {
            state: {subscriptionData: this.quoteData}
          });
        }, 2500);

        this.apiService.postRequest('company/save-contract', {
          price: this.quoteData.totalAmount,
          subscriptionTier: this.quoteData.subscriptionType,
        }).subscribe(console.log)
      }
    } catch (error) {
      this.paymentError = (error as Error).message || 'Payment processing failed';
      console.error('Payment error:', error);
    } finally {
      this.loading = false;
    }
  }

  ngOnDestroy() {
    if (this.card) {
      this.card.destroy();
    }
  }
}
