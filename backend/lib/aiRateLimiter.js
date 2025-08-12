// Maximum 2 requests per minute
class AIRateLimiter {
  constructor() {
    this.requests = [];
    this.maxRequests = 2;
    this.windowMs = 60 * 1000; // 1 minute
  }

  canMakeRequest() {
    const now = Date.now();
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(timestamp => 
      now - timestamp < this.windowMs
    );
    
    return this.requests.length < this.maxRequests;
  }

  recordRequest() {
    this.requests.push(Date.now());
  }

  getTimeUntilReset() {
    if (this.requests.length === 0) return 0;
    
    const oldestRequest = Math.min(...this.requests);
    const timeUntilReset = this.windowMs - (Date.now() - oldestRequest);
    
    return Math.max(0, Math.ceil(timeUntilReset / 1000)); // Return seconds
  }

  getRemainingRequests() {
    const now = Date.now();
    this.requests = this.requests.filter(timestamp => 
      now - timestamp < this.windowMs
    );
    
    return Math.max(0, this.maxRequests - this.requests.length);
  }
}

const aiRateLimiter = new AIRateLimiter();

export default aiRateLimiter;
