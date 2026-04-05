const { SignJWT } = require('jose');
async function test() {
  const key = new TextEncoder().encode('techwork-super-secret-key-for-dev');
  const token = await new SignJWT({ userId: '3dfb90e9-cf96-4c0c-bb92-155fa4dbf576', role: 'ADMIN', expires: Date.now() + 100000 })
    .setProtectedHeader({ alg: 'HS256' }).sign(key);
  
  const res = await fetch('http://localhost:3000/admin', {
    headers: { 'Cookie': 'techwork_session=' + token }
  });
  console.log(res.status);
  const text = await res.text();
  console.log(text.substring(0, 500));
}
test();
