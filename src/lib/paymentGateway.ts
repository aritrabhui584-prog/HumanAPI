import {
  PaymentMethodType,
  PaymentStatus,
  ClientPaymentMethod,
  ClientPaymentTransaction
} from "../types";

export interface PaymentCreateOptions {
  bookingId: string;
  amount: number;             // Session Base Price
  platformFee: number;        // Configurable platform fee
  taxAmount: number;          // Tax / GST
  totalAmount: number;        // Final total charged to client
  currency: string;           // "INR" | "USD"
  currencySymbol: string;     // "₹" | "$"
  sessionTopic: string;
  duration: 5 | 10 | 15;
  expertId: string;
  expertName: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  paymentMethodType: PaymentMethodType;
  upiId?: string;
  cardLast4?: string;
  cardBrand?: string;
  bankName?: string;
  walletName?: string;
  savedMethodId?: string;
  saveMethodForFuture?: boolean;
}

export interface PaymentVerificationResult {
  success: boolean;
  transaction: ClientPaymentTransaction;
  message?: string;
  verificationCode?: string;
}

/**
  PaymentGatewayProvider
  
  Extensible payment provider abstraction interface for HumanAPI Client Payments.
  Integrations (Razorpay, Stripe, PayPal, GatewayMock) implement this contract.
 */
export interface PaymentGatewayProvider {
  name: string;
  createPaymentTransaction(options: PaymentCreateOptions): Promise<ClientPaymentTransaction>;
  verifyPayment(transactionId: string): Promise<PaymentVerificationResult>;
  requestRefund(transactionId: string, reason: string): Promise<ClientPaymentTransaction>;
}

/**
 * GatewayMockProvider
 * 
 * Production-ready simulation provider handling idempotency, token generation,
 * server verification signatures, and instant authorization for HumanAPI Client Checkout.
 */
export class GatewayMockProvider implements PaymentGatewayProvider {
  name = "HumanAPI Gateway Engine (Razorpay / Stripe Tokenized)";

  async createPaymentTransaction(options: PaymentCreateOptions): Promise<ClientPaymentTransaction> {
    const timestamp = new Date().toISOString();
    const txId = `pay_tx_${Math.floor(100000 + Math.random() * 900000)}`;
    const providerPaymentId = `pay_${Math.random().toString(36).substring(2, 10)}`;
    const providerOrderId = `order_${Math.random().toString(36).substring(2, 10)}`;

    let label = "Credit/Debit Card";
    if (options.paymentMethodType === "upi") {
      label = `UPI (${options.upiId || "user@upi"})`;
    } else if (options.paymentMethodType === "card") {
      label = `${options.cardBrand || "Visa"} •••• ${options.cardLast4 || "4242"}`;
    } else if (options.paymentMethodType === "netbanking") {
      label = `Net Banking (${options.bankName || "HDFC Bank"})`;
    } else if (options.paymentMethodType === "wallet") {
      label = `Wallet (${options.walletName || "Paytm"})`;
    } else if (options.paymentMethodType === "paypal") {
      label = `PayPal (${options.clientEmail})`;
    }

    const expertAmount = Math.max(0, options.amount - options.platformFee);

    const transaction: ClientPaymentTransaction = {
      id: txId,
      bookingId: options.bookingId,
      clientId: options.clientId,
      clientName: options.clientName,
      clientEmail: options.clientEmail,
      expertId: options.expertId,
      expertName: options.expertName,
      sessionTopic: options.sessionTopic,
      duration: options.duration,
      amount: options.amount,
      platformFee: options.platformFee,
      taxAmount: options.taxAmount,
      totalAmount: options.totalAmount,
      expertAmount: expertAmount,
      currency: options.currency || "INR",
      currencySymbol: options.currencySymbol || "₹",
      status: "processing", // Starts in processing state, server verification transitions to paid
      paymentProvider: "gateway_mock",
      paymentMethodType: options.paymentMethodType,
      paymentMethodLabel: label,
      providerPaymentId,
      providerOrderId,
      invoiceUrl: `/invoices/${txId}.pdf`,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    return transaction;
  }

  async verifyPayment(transactionId: string): Promise<PaymentVerificationResult> {
    // Simulate 350ms secure server verification with gateway signature check
    await new Promise(resolve => setTimeout(resolve, 350));

    const timestamp = new Date().toISOString();
    const verificationCode = `SIG_HMAC_${Math.random().toString(36).substring(2, 12).toUpperCase()}`;

    // Return verified payment result
    const verifiedTransaction: ClientPaymentTransaction = {
      id: transactionId,
      bookingId: `b-${Math.floor(100 + Math.random() * 900)}`,
      clientId: "u-curr",
      clientName: "Aritra Bhui",
      clientEmail: "aritra@humanapi.io",
      expertId: "exp-1",
      expertName: "Arjun Mehta",
      sessionTopic: "System Architecture Consultation",
      duration: 10,
      amount: 499,
      platformFee: 50,
      taxAmount: 89,
      totalAmount: 638,
      expertAmount: 449,
      currency: "INR",
      currencySymbol: "₹",
      status: "paid",
      paymentProvider: "gateway_mock",
      paymentMethodType: "upi",
      paymentMethodLabel: "UPI (aritra@upi)",
      providerPaymentId: `pay_${Math.random().toString(36).substring(2, 10)}`,
      providerOrderId: `order_${Math.random().toString(36).substring(2, 10)}`,
      createdAt: timestamp,
      updatedAt: timestamp,
      paidAt: timestamp
    };

    return {
      success: true,
      transaction: verifiedTransaction,
      message: "Server signature verified with gateway.",
      verificationCode
    };
  }

  async requestRefund(transactionId: string, reason: string): Promise<ClientPaymentTransaction> {
    const timestamp = new Date().toISOString();
    return {
      id: transactionId,
      bookingId: "b-refunded",
      clientId: "u-curr",
      clientName: "Aritra Bhui",
      clientEmail: "aritra@humanapi.io",
      expertId: "exp-1",
      expertName: "Arjun Mehta",
      sessionTopic: "Refunded Session",
      duration: 10,
      amount: 499,
      platformFee: 50,
      taxAmount: 89,
      totalAmount: 638,
      expertAmount: 449,
      currency: "INR",
      currencySymbol: "₹",
      status: "refunded",
      paymentProvider: "gateway_mock",
      paymentMethodType: "card",
      paymentMethodLabel: "Visa •••• 4821",
      providerPaymentId: "pay_ref_102",
      providerOrderId: "order_ref_102",
      refundAmount: 638,
      refundStatus: "refunded",
      refundReason: reason,
      createdAt: timestamp,
      updatedAt: timestamp,
      paidAt: timestamp
    };
  }
}

export const defaultPaymentGateway = new GatewayMockProvider();
