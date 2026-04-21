// Test utility to verify user ID persistence
import { 
  getStoredUserId, 
  getUserByEmail, 
  cacheUserByEmail, 
  debugStorage,
  clearUserCache,
  refreshUserCache 
} from './sheetsLogger.js';

// Test function to simulate different scenarios
export function testUserIdPersistence() {
  // Clear everything first
  clearUserCache();
  
  // Test 1: No user stored
  const userId1 = getStoredUserId();
  
  // Test 2: Cache user by email
  cacheUserByEmail('test@example.com', 'u0001');
  const cachedUser = getUserByEmail('test@example.com');
  
  // Test 3: Store user ID directly
  localStorage.setItem('vynqe_user_id', 'u0002');
  const userId2 = getStoredUserId();
  
  // Test 4: Debug storage
  const debugInfo = debugStorage();
  
  return {
    test1: userId1 === null,
    test2: cachedUser?.userId === 'u0001',
    test3: userId2 === 'u0002',
    test4: !!debugInfo
  };
}

// Test function to simulate BookDemo flow
export async function testBookDemoFlow() {
  // Clear cache
  clearUserCache();
  
  // Simulate first BookDemo submission
  cacheUserByEmail('john@company.com', 'u0001');
  localStorage.setItem('vynqe_user_id', 'u0001');
  
  const firstUserId = getStoredUserId();
  const firstCachedUser = getUserByEmail('john@company.com');
  
  // Simulate page refresh (localStorage persists)
  const refreshedUserId = getStoredUserId();
  const refreshedCachedUser = getUserByEmail('john@company.com');
  
  // Simulate second demo by same user
  const secondUserId = getStoredUserId();
  const secondCachedUser = getUserByEmail('john@company.com');
  
  const success = firstUserId === 'u0001' && 
                  refreshedUserId === 'u0001' && 
                  secondUserId === 'u0001' &&
                  firstCachedUser?.userId === 'u0001' &&
                  refreshedCachedUser?.userId === 'u0001' &&
                  secondCachedUser?.userId === 'u0001';
  
  return success;
}

// Export test functions for use in browser console
if (typeof window !== 'undefined') {
  window.testUserIdPersistence = testUserIdPersistence;
  window.testBookDemoFlow = testBookDemoFlow;
  window.debugStorage = debugStorage;
  window.clearUserCache = clearUserCache;
}
