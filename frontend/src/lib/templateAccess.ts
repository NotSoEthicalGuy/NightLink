import type { User } from '../types'

/** Core themes available on the Standard plan. All other known template IDs require Premium. */
export const STANDARD_PLAN_TEMPLATE_IDS = new Set([
    'minimalist',
    'vibrant',
    'neon',
])

export function isPremiumOnlyTemplate(templateId: string | undefined): boolean {
    if (!templateId) return false
    return !STANDARD_PLAN_TEMPLATE_IDS.has(templateId.toLowerCase())
}

/** Standard subscribers only; Premium and legacy subscribers (plan unset) get full theme access. */
export function isStandardPlanUser(user: User | null | undefined): boolean {
    return !!user?.isSubscribed && user.subscriptionPlan === 'STANDARD'
}

export function isTemplateLockedForStandardUser(
    user: User | null | undefined,
    templateId: string
): boolean {
    return isStandardPlanUser(user) && isPremiumOnlyTemplate(templateId)
}
