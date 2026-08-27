import { useMemo } from 'react';

export type SubscriptionStatus = 'active' | 'warning_trial' | 'warning_monthly' | 'expired' | 'partner';

interface SubscriptionResult {
  status: SubscriptionStatus;
  daysLeft: number;
}

export function useSubscription(
  subscriptionStatus?: string,
  subscriptionEndsAt?: any // Firestore Timestamp or similar object with toDate/toMillis
): SubscriptionResult {
  return useMemo(() => {
    // Si no hay status ni fecha, por defecto a accounts antiguas (active)
    // El usuario indicó que si ya está en la bd y no tiene datos, es active.
    if (!subscriptionStatus || !subscriptionEndsAt) {
      return { status: 'active', daysLeft: 999 };
    }

    if (subscriptionStatus === 'partner') {
      return { status: 'partner', daysLeft: 9999 };
    }

    let endDate = 0;
    
    // Parse Firestore Timestamp or ISO string
    if (typeof subscriptionEndsAt.toMillis === 'function') {
      endDate = subscriptionEndsAt.toMillis();
    } else if (typeof subscriptionEndsAt.toDate === 'function') {
      endDate = subscriptionEndsAt.toDate().getTime();
    } else if (subscriptionEndsAt instanceof Date) {
      endDate = subscriptionEndsAt.getTime();
    } else if (typeof subscriptionEndsAt === 'string' || typeof subscriptionEndsAt === 'number') {
      endDate = new Date(subscriptionEndsAt).getTime();
    } else if (subscriptionEndsAt && typeof subscriptionEndsAt.seconds === 'number') {
      endDate = subscriptionEndsAt.seconds * 1000;
    } else {
       // Fallback
       return { status: 'active', daysLeft: 999 };
    }

    const now = Date.now();
    const diffTime = endDate - now;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysLeft <= 0) {
      return { status: 'expired', daysLeft };
    }

    if (subscriptionStatus === 'trial' && daysLeft <= 2) {
      return { status: 'warning_trial', daysLeft };
    }

    if (subscriptionStatus === 'monthly' && daysLeft <= 5) {
      return { status: 'warning_monthly', daysLeft };
    }

    return { status: 'active', daysLeft };

  }, [subscriptionStatus, subscriptionEndsAt]);
}
