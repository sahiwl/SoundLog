// Maximum 2 requests per minute (configurable via environment variables)
// IMPORTANT: This is an in-memory rate limiter. For production with multiple server instances,
// consider using Redis-based rate limiting to coordinate across all instances.

class AIRateLimiter {
  constructor() {
    this.requests = [];
    // Make configurable via environment variables
    this.maxRequests = parseInt(process.env.AI_MAX_REQUESTS_PER_MINUTE) || 2;
    this.windowMs = (parseInt(process.env.AI_RATE_LIMIT_WINDOW_SECONDS) || 60) * 1000; // 1 minute default
  }

  /**
   * Check if a request can be made and atomically record it if allowed.
   * This prevents race conditions where two requests check simultaneously.
   * @returns {boolean} true if request was recorded, false if rate limit exceeded
   */
  canMakeRequestAndRecord() {
    const now = Date.now();
    const cutoff = now - this.windowMs;
    
    // Optimized: Remove old requests from front (more efficient than filtering entire array)
    while (this.requests.length > 0 && this.requests[0] < cutoff) {
      this.requests.shift();
    }
    
    // Atomic check-and-record: Only record if under limit
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      console.log(`[RATE_LIMITER] Request recorded. Remaining: ${this.maxRequests - this.requests.length}/${this.maxRequests}`);
      return true;
    }
    
    console.log(`[RATE_LIMITER] Rate limit exceeded. Current: ${this.requests.length}/${this.maxRequests}`);
    return false;
  }

  /**
   * Check if a request can be made WITHOUT recording it.
   * Use this for checking status only.
   * @returns {boolean} true if under limit, false if exceeded
   */
  canMakeRequest() {
    const now = Date.now();
    const cutoff = now - this.windowMs;
    
    // Remove old requests
    while (this.requests.length > 0 && this.requests[0] < cutoff) {
      this.requests.shift();
    }
    
    return this.requests.length < this.maxRequests;
  }

  /**
   * Undo the last request (useful if API call failed after recording)
   * This allows failed requests to not count against the limit
   */
  undoLastRequest() {
    if (this.requests.length > 0) {
      this.requests.pop();
      console.log(`[RATE_LIMITER] Last request undone. Remaining: ${this.maxRequests - this.requests.length}/${this.maxRequests}`);
    }
  }

  /**
   * Get time until the oldest request expires (rate limit resets)
   * @returns {number} seconds until reset
   */
  getTimeUntilReset() {
    if (this.requests.length === 0) return 0;
    
    const oldestRequest = Math.min(...this.requests);
    const timeUntilReset = this.windowMs - (Date.now() - oldestRequest);
    
    return Math.max(0, Math.ceil(timeUntilReset / 1000)); // Return seconds
  }

  /**
   * Get remaining requests in current window
   * @returns {number} remaining requests
   */
  getRemainingRequests() {
    const now = Date.now();
    const cutoff = now - this.windowMs;
    
    // Remove old requests
    while (this.requests.length > 0 && this.requests[0] < cutoff) {
      this.requests.shift();
    }
    
    return Math.max(0, this.maxRequests - this.requests.length);
  }

  /**
   * Get detailed statistics about rate limiter state
   * Useful for debugging and monitoring
   */
  getStats() {
    const now = Date.now();
    const cutoff = now - this.windowMs;
    
    // Remove old requests
    while (this.requests.length > 0 && this.requests[0] < cutoff) {
      this.requests.shift();
    }
    
    return {
      currentRequests: this.requests.length,
      maxRequests: this.maxRequests,
      windowMs: this.windowMs,
      windowSeconds: this.windowMs / 1000,
      remainingRequests: Math.max(0, this.maxRequests - this.requests.length),
      timeUntilReset: this.getTimeUntilReset(),
      oldestRequest: this.requests.length > 0 ? new Date(Math.min(...this.requests)).toISOString() : null,
      newestRequest: this.requests.length > 0 ? new Date(Math.max(...this.requests)).toISOString() : null,
      isAtLimit: this.requests.length >= this.maxRequests
    };
  }
}

const aiRateLimiter = new AIRateLimiter();

export default aiRateLimiter;
