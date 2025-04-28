// Import the Redis library
const Redis = require("ioredis");

// Create a connection to Redis (running in Docker)
const redis = new Redis({
    host: "localhost", // Docker's default IP
    port: 6379, // Redis port
});

// Test the connection
async function testConnection() {
    try {
        const reply = await redis.ping();
        console.log("Redis says:", reply); // Should print "PONG"
    } catch (err) {
        console.error("Failed to connect to Redis:", err);
    }
}
testConnection();

// ---------------- String ----------------
async function setString() {
    await redis.set("message", "Hello from Node.js!");
    console.log("String data saved!");
}
setString();

async function getString() {
    const value = await redis.get("message");
    console.log("String value:", value); // "Hello from Node.js!"
}
getString();

// ---------------- List ----------------
async function setList() {
    await redis.rpush("fruits", "apple", "banana", "cherry");
    console.log("List data saved!");
}
setList();

async function getList() {
    const fruits = await redis.lrange("fruits", 0, -1);
    console.log("List values:", fruits); // ["apple", "banana", "cherry"]
}
getList();

// ---------------- Set ----------------
async function setSet() {
    await redis.sadd("colors", "red", "blue", "green");
    console.log("Set data saved!");
}
setSet();

async function getSet() {
    const colors = await redis.smembers("colors");
    console.log("Set values:", colors); // ["red", "blue", "green"]
}
getSet();

// ---------------- Hash ----------------
async function setHash() {
    await redis.hset("user:1001", "name", "John", "age", "30", "city", "New York");
    console.log("Hash data saved!");
}
setHash();

async function getHash() {
    const user = await redis.hgetall("user:1001");
    console.log("Hash values:", user); // { name: "John", age: "30", city: "New York" }
}
getHash();

// ---------------- Sorted Set ----------------
async function setSortedSet() {
    await redis.zadd("scores", 100, "Alice", 200, "Bob", 150, "Charlie");
    console.log("Sorted Set data saved!");
}
setSortedSet();

async function getSortedSet() {
    const scores = await redis.zrange("scores", 0, -1, "WITHSCORES");
    console.log("Sorted Set values:", scores); // ["Alice", "100", "Charlie", "150", "Bob", "200"]
}
getSortedSet();





// Set key with TTL
async function setPromoCode() {
  await redis.setex("promo_code", 30, "SALE20"); // Key "promo_code" expires after 30 seconds
  console.log("✅ Promo code set for 30 seconds!");
}

// Get the promo code
async function getPromoCode() {
  const promo = await redis.get("promo_code");
  console.log("🔍 Promo code value:", promo); // "SALE20" if within 30 sec, otherwise null
}

// Demo
async function runTTLdemo() {
  await setPromoCode();

  // Wait a bit (optional)
  setTimeout(async () => {
    await getPromoCode(); // Should show "SALE20" if within 30 sec
  }, 5000); // 5 seconds delay

  // Wait longer after expiration
  setTimeout(async () => {
    await getPromoCode(); // Should show null after 35 sec
  }, 35000); // 35 seconds later
}

runTTLdemo();







// ---------------- Expire ----------------

// Set key and then set TTL
async function setPromoCode() {
  await redis.set("promo_code", "SALE20"); // Set the key first
  console.log("✅ Promo code set!");

  // Now set the TTL (expire after 30 seconds)
  await redis.expire("promo_code", 30); // Set expiration to 30 seconds
  console.log("✅ Expiration set for 30 seconds!");
}

// Get the promo code
async function getPromoCode() {
  const promo = await redis.get("promo_code");
  console.log("🔍 Promo code value:", promo); // "SALE20" if within TTL, otherwise null
}

// Demo
async function runExpireDemo() {
  await setPromoCode();

  // Wait for 5 seconds to get the promo code (should still exist)
  setTimeout(async () => {
    await getPromoCode(); // Should return "SALE20"
  }, 5000); // 5 seconds delay

  // Wait longer after expiration
  setTimeout(async () => {
    await getPromoCode(); // Should return null after 35 seconds (TTL expired)
  }, 35000); // 35 seconds later
}

runExpireDemo();




// ---------------- Delete a Key (optional) ----------------
// async function delKey() {
//     await redis.del("message");
//     console.log("Key deleted!");
// }
// delKey();