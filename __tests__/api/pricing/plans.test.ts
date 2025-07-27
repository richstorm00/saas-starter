import { GET } from '@/app/api/pricing/plans/route';

describe('/api/pricing/plans', () => {
  it('returns pricing plans successfully', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('plans');
    expect(Array.isArray(data.plans)).toBe(true);
    expect(data.plans.length).toBeGreaterThan(0);
    
    const plan = data.plans[0];
    expect(plan).toHaveProperty('id');
    expect(plan).toHaveProperty('name');
    expect(plan).toHaveProperty('price');
    expect(plan).toHaveProperty('currency');
    expect(plan).toHaveProperty('features');
    expect(Array.isArray(plan.features)).toBe(true);
  });

  it('returns correct plan structure', async () => {
    const response = await GET();
    const data = await response.json();

    const plans = data.plans;
    plans.forEach((plan: any) => {
      expect(typeof plan.id).toBe('string');
      expect(typeof plan.name).toBe('string');
      expect(typeof plan.price).toBe('number');
      expect(typeof plan.currency).toBe('string');
      expect(typeof plan.description).toBe('string');
      expect(Array.isArray(plan.features)).toBe(true);
      expect(typeof plan.limits).toBe('object');
    });
  });

  it('includes popular flag for professional plan', async () => {
    const response = await GET();
    const data = await response.json();

    const professionalPlan = data.plans.find((p: any) => p.id === 'professional');
    expect(professionalPlan).toBeDefined();
    expect(professionalPlan.popular).toBe(true);
  });

  it('has correct intervals', async () => {
    const response = await GET();
    const data = await response.json();

    data.plans.forEach((plan: any) => {
      expect(['month', 'year']).toContain(plan.interval);
    });
  });
});