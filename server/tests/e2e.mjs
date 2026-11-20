/**
 * End-to-end tests for the MarketNest cart → order → fulfilment flow.
 *
 * Runs against a real MongoDB. Start one first, e.g.:
 *   docker run -d --name marketnest-test-mongo -p 27017:27017 mongo:7
 *   npm run test:e2e
 *
 * Override the database with MONGO_TEST_URI (default: local mongodb).
 * The database is dropped before and after the run.
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.MONGO_URI =
  process.env.MONGO_TEST_URI || 'mongodb://127.0.0.1:27017/marketnest_e2e';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'e2e-access-secret';
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'e2e-refresh-secret';

const { default: mongoose } = await import('mongoose');
const { default: app } = await import('../src/app.js');

await mongoose.connect(process.env.MONGO_URI);
await mongoose.connection.dropDatabase();

const { default: OrderModel } = await import('../src/models/Order.js');
await OrderModel.init(); // ensure the idempotency unique index exists

const server = app.listen(0);
const { port } = server.address();
const BASE = `http://127.0.0.1:${port}/api`;

const results = [];
const check = (name, condition, detail = '') => {
  results.push([condition ? 'PASS' : 'FAIL', name, detail]);
  if (!condition) console.log('FAIL -', name, detail);
};

const cookieHeader = (setCookies = []) =>
  setCookies.map((c) => c.split(';')[0]).join('; ');

const api = async (
  method,
  path,
  { body, token, cookie, headers = {} } = {}
) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const setCookies =
    typeof res.headers.getSetCookie === 'function'
      ? res.headers.getSetCookie()
      : [];

  let json = null;
  try {
    json = await res.json();
  } catch {
    // ignore non-JSON
  }

  return { status: res.status, json, cookie: cookieHeader(setCookies) };
};

const unique = () => Math.random().toString(36).slice(2, 10);

const signup = async (role, name) => {
  const email = `${role}-${unique()}@example.com`;
  const res = await api('POST', '/auth/signup', {
    body: { name, email, password: 'Password123', role },
  });
  return {
    email,
    password: 'Password123',
    token: res.json?.data?.accessToken,
    cookie: res.cookie,
    user: res.json?.data?.user,
    status: res.status,
    raw: res,
  };
};

const createProduct = async (brand, overrides = {}) => {
  const res = await api('POST', '/products', {
    token: brand.token,
    body: {
      name: `Product ${unique()}`,
      description: 'E2E product',
      price: 100,
      category: 'clothing',
      status: 'published',
      stock: 10,
      ...overrides,
    },
  });
  return { status: res.status, product: res.json?.data?.product, raw: res };
};

const address = {
  fullName: 'Aarav Sharma',
  phone: '9876543210',
  street: '12 MG Road',
  city: 'Bengaluru',
  state: 'Karnataka',
  postalCode: '560001',
  country: 'India',
};

const placeOrder = (customer, items, extra = {}) =>
  api('POST', '/orders', {
    token: customer.token,
    body: { items, shippingAddress: address, paymentMethod: 'cod', ...extra },
  });

const stockOf = async (id) => {
  const { default: Product } = await import('../src/models/Product.js');
  return (await Product.findById(id)).stock;
};

// ---------------------------------------------------------------- AUTH ----
const brandA = await signup('brand', 'Brand A');
const brandB = await signup('brand', 'Brand B');
const customer1 = await signup('customer', 'Customer One');
const customer2 = await signup('customer', 'Customer Two');

check('signup customer returns token + cookie', brandA.status === 201 && !!brandA.token && !!brandA.cookie);
check('password hash never returned', !('password' in (brandA.user || {})));

const me = await api('GET', '/auth/me', { token: customer1.token });
check('GET /auth/me works', me.status === 200 && me.json.data.user.email === customer1.email);
check('me does not leak password/refreshToken', !me.json.data.user.password && !me.json.data.user.refreshToken);

const wrongLogin = await api('POST', '/auth/login', {
  body: { email: customer1.email, password: 'wrong-password' },
});
check('wrong password -> 401', wrongLogin.status === 401);

const upperLogin = await api('POST', '/auth/login', {
  body: { email: customer1.email.toUpperCase(), password: customer1.password },
});
check('login normalizes email casing', upperLogin.status === 200);

const dupSignup = await api('POST', '/auth/signup', {
  body: {
    name: 'Dup',
    email: customer1.email,
    password: 'Password123',
    role: 'customer',
  },
});
check('duplicate signup -> 409', dupSignup.status === 409);

const refreshed = await api('POST', '/auth/refresh', { cookie: customer1.cookie });
check('refresh with cookie returns access token', refreshed.status === 200 && !!refreshed.json.data.accessToken);

const refreshedBad = await api('POST', '/auth/refresh', {
  cookie: 'refreshToken=not-a-real-token',
});
check('invalid refresh token -> 401', refreshedBad.status === 401);

const logout = await api('POST', '/auth/logout', { cookie: customer1.cookie });
check('logout without access token succeeds', logout.status === 200);
check('logout clears cookie', /^refreshToken=$/.test(logout.cookie || ''));

const refreshAfterLogout = await api('POST', '/auth/refresh', {
  cookie: customer1.cookie,
});
check('refresh after logout -> 401', refreshAfterLogout.status === 401);

// Re-login customer1 for the rest of the flow.
const relogin = await api('POST', '/auth/login', {
  body: { email: customer1.email, password: customer1.password },
});
customer1.token = relogin.json.data.accessToken;
customer1.cookie = relogin.cookie;
check('re-login after logout works', relogin.status === 200);

// ------------------------------------------------------------ PRODUCTS ----
const pA = await createProduct(brandA, { name: 'Brand A Jacket', price: 100.5, stock: 5 });
const pA2 = await createProduct(brandA, { name: 'Brand A Cap', price: 20, stock: 3 });
const pB = await createProduct(brandB, { name: 'Brand B Tote', price: 50, stock: 8 });
const draft = await createProduct(brandA, { name: 'Draft Shoe', status: 'draft', stock: 4 });

check('brand creates published product', pA.status === 201 && pA.product.stock === 5);
check('negative stock rejected', (await createProduct(brandA, { stock: -1 })).status === 400);
check('fractional stock rejected', (await createProduct(brandA, { stock: 1.5 })).status === 400);
check(
  'customer cannot create product',
  (
    await api('POST', '/products', {
      token: customer1.token,
      body: { name: 'Nope', price: 1, category: 'clothing', stock: 1 },
    })
  ).status === 403
);

const listAnonymous = await api('GET', '/products?limit=50');
check('public listing works', listAnonymous.status === 200);
check(
  'public listing hides drafts',
  !listAnonymous.json.data.products.some((p) => p._id === draft.product._id)
);

const draftAnon = await api('GET', `/products/${draft.product._id}`);
check('draft product hidden from anonymous', draftAnon.status === 404);
const draftOwner = await api('GET', `/products/${draft.product._id}`, {
  token: brandA.token,
});
check('draft visible to owning brand', draftOwner.status === 200);
const draftOtherBrand = await api('GET', `/products/${draft.product._id}`, {
  token: brandB.token,
});
check('draft hidden from other brand', draftOtherBrand.status === 404);

const searchParen = await api('GET', '/products?search=%28');
check('regex metacharacters are safe', searchParen.status === 200);
const searchInject = await api('GET', '/products?search[$ne]=x');
check('query operator injection rejected', searchInject.status === 400);
const badCategory = await api('GET', '/products?category=nope');
check('invalid category rejected', badCategory.status === 400);
const badPage = await api('GET', '/products?page=-1');
check('negative page rejected', badPage.status === 400);
const hugeLimit = await api('GET', '/products?limit=999');
check('oversized limit rejected', hugeLimit.status === 400);

// ----------------------------------------------------------- CHECKOUT -----
check(
  'brand cannot place order',
  (await placeOrder(brandA, [{ product: pA.product._id, quantity: 1 }])).status === 403
);

const emptyItems = await api('POST', '/orders', {
  token: customer1.token,
  body: { items: [], shippingAddress: address },
});
check('empty items rejected', emptyItems.status === 400);

const badQty = await placeOrder(customer1, [{ product: pA.product._id, quantity: 0 }]);
check('zero quantity rejected', badQty.status === 400);

const overQty = await placeOrder(customer1, [{ product: pA.product._id, quantity: 100 }]);
check('quantity > 99 rejected', overQty.status === 400);

const overStock = await placeOrder(customer1, [
  { product: pA.product._id, quantity: 6 },
]);
check('quantity above stock rejected', overStock.status === 400);

const missingAddress = await api('POST', '/orders', {
  token: customer1.token,
  body: { items: [{ product: pA.product._id, quantity: 1 }] },
});
check('missing shipping address rejected', missingAddress.status === 400);

const badPhone = await api('POST', '/orders', {
  token: customer1.token,
  body: {
    items: [{ product: pA.product._id, quantity: 1 }],
    shippingAddress: { ...address, phone: 'abc' },
  },
});
check('invalid phone rejected', badPhone.status === 400);

const unknownProduct = await placeOrder(customer1, [
  { product: 'aaaaaaaaaaaaaaaaaaaaaaaa', quantity: 1 },
]);
check('unknown product rejected', unknownProduct.status === 400);

const tooManyLines = await placeOrder(
  customer1,
  Array.from({ length: 51 }, () => ({ product: pA.product._id, quantity: 1 }))
);
check('more than 50 order lines rejected', tooManyLines.status === 400);

const tooManyUnits = await placeOrder(customer1, [
  { product: pA.product._id, quantity: 99 },
  { product: pA2.product._id, quantity: 99 },
  { product: pB.product._id, quantity: 99 },
]);
check('order total quantity capped', tooManyUnits.status === 400);

const archived = await api('DELETE', `/products/${pB.product._id}`, {
  token: brandB.token,
});
check('brand archives product', archived.status === 200);
check(
  'archived product cannot be ordered',
  (await placeOrder(customer1, [{ product: pB.product._id, quantity: 1 }])).status === 400
);
// Restore pB to published for multi-brand test via update.
const restoredB = await api('PUT', `/products/${pB.product._id}`, {
  token: brandB.token,
  body: { status: 'published' },
});
check('brand can republish product', restoredB.status === 200);

// Happy path: duplicate lines are merged.
const happy = await placeOrder(customer1, [
  { product: pA.product._id, quantity: 1 },
  { product: pA.product._id.toUpperCase(), quantity: 2 },
]);
check('order with uppercase id succeeds', happy.status === 201);
check('duplicate lines merged into one', happy.json?.data?.orders?.[0]?.items?.length === 1);
check('merged quantity applied', happy.json?.data?.orders?.[0]?.items?.[0]?.quantity === 3);
check('stock decremented by merged qty', (await stockOf(pA.product._id)) === 2);
check(
  'order total uses price snapshot',
  happy.json?.data?.orders?.[0]?.totalAmount === 301.5
);
check('order starts pending', happy.json?.data?.orders?.[0]?.status === 'pending');
const order1 = happy.json.data.orders[0];

// Idempotency: same key replays instead of double ordering.
const idemKey = `key-${unique()}`;
const idem1 = await api('POST', '/orders', {
  token: customer1.token,
  headers: { 'Idempotency-Key': idemKey },
  body: {
    items: [{ product: pA2.product._id, quantity: 1 }],
    shippingAddress: address,
  },
});
const idem2 = await api('POST', '/orders', {
  token: customer1.token,
  headers: { 'Idempotency-Key': idemKey },
  body: {
    items: [{ product: pA2.product._id, quantity: 1 }],
    shippingAddress: address,
  },
});
check('idempotent create returns 201 then 200', idem1.status === 201 && idem2.status === 200);
check('idempotent replay flagged', idem2.json?.data?.idempotentReplay === true);
check('idempotent replay does not decrement stock twice', (await stockOf(pA2.product._id)) === 2);

// Multi-brand cart splits into one order per brand.
const multi = await placeOrder(customer1, [
  { product: pA.product._id, quantity: 1 },
  { product: pB.product._id, quantity: 2 },
]);
check('multi-brand checkout succeeds', multi.status === 201);
check('multi-brand checkout splits into 2 orders', multi.json?.data?.orders?.length === 2);
const brandIds = new Set(
  multi.json.data.orders.map((o) => o.items[0].brand._id || o.items[0].brand)
);
check('each split order is single-brand', brandIds.size === 2);
check('multi-brand stock decremented (A)', (await stockOf(pA.product._id)) === 1);
check('multi-brand stock decremented (B)', (await stockOf(pB.product._id)) === 6);

// --------------------------------------------------------------- VIEW -----
const myOrders = await api('GET', '/orders/my?limit=50', { token: customer1.token });
check('customer lists own orders', myOrders.status === 200 && myOrders.json.data.orders.length >= 3);

const paged = await api('GET', '/orders/my?page=1&limit=2', { token: customer1.token });
check('order pagination works', paged.status === 200 && paged.json.data.orders.length === 2);
check('order pagination has next page', paged.json.data.pagination.hasNextPage === true);

const badOrderPage = await api('GET', '/orders/my?page=-2', {
  token: customer1.token,
});
check('negative order page rejected', badOrderPage.status === 400);

const badOrderStatus = await api('GET', '/orders/my?status=hacked', {
  token: customer1.token,
});
check('invalid order status filter rejected', badOrderStatus.status === 400);

const otherView = await api('GET', `/orders/${order1._id}`, {
  token: customer2.token,
});
check('other customer cannot view order', otherView.status === 403);

const ownerView = await api('GET', `/orders/${order1._id}`, {
  token: customer1.token,
});
check('owner can view order', ownerView.status === 200);
check(
  'order carries a status timeline',
  Array.isArray(ownerView.json.data.order.statusHistory) &&
    ownerView.json.data.order.statusHistory.length >= 1
);

const customerOnBrand = await api('GET', '/orders/brand', {
  token: customer1.token,
});
check('customer blocked from brand orders', customerOnBrand.status === 403);

const brandOnCustomer = await api('GET', '/orders/my', { token: brandA.token });
check('brand blocked from customer orders', brandOnCustomer.status === 403);

const badIdView = await api('GET', '/orders/not-an-object-id', {
  token: customer1.token,
});
check('malformed order id -> 400 (not 500)', badIdView.status === 400);

const brandAOrders = await api('GET', '/orders/brand?limit=50', {
  token: brandA.token,
});
check('brand lists participating orders', brandAOrders.status === 200 && brandAOrders.json.data.orders.length > 0);
check(
  'brand only sees own line items',
  brandAOrders.json.data.orders.every((o) =>
    o.items.every((i) => String(i.brand?._id || i.brand) === String(brandA.user.id))
  )
);
check(
  'brand order total only covers own items',
  brandAOrders.json.data.orders.every(
    (o) =>
      Math.round(o.brandTotal * 100) / 100 ===
      Math.round(o.items.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100
  )
);

const multiOrderForB = multi.json.data.orders.find(
  (o) => String(o.items[0].brand._id || o.items[0].brand) === String(brandB.user.id)
);
const brandBOnAOrder = await api(
  'PATCH',
  `/orders/${order1._id}/status`,
  { token: brandB.token, body: { status: 'confirmed' } }
);
check('uninvolved brand cannot update order', brandBOnAOrder.status === 403);

const brandAViewOwnOrder = await api('GET', `/orders/${order1._id}`, {
  token: brandA.token,
});
check('brand can view own order', brandAViewOwnOrder.status === 200);
check(
  'brand view of order is item-scoped',
  brandAViewOwnOrder.json.data.order.items.length === 1
);

// ------------------------------------------------------- STATUS FLOW ------
const badTransition = await api('PATCH', `/orders/${order1._id}/status`, {
  token: brandA.token,
  body: { status: 'shipped' },
});
check('pending -> shipped rejected', badTransition.status === 400);

const confirm1 = await api('PATCH', `/orders/${order1._id}/status`, {
  token: brandA.token,
  body: { status: 'confirmed' },
});
check('pending -> confirmed works', confirm1.status === 200 && confirm1.json.data.order.status === 'confirmed');

const ship1 = await api('PATCH', `/orders/${order1._id}/status`, {
  token: brandA.token,
  body: { status: 'shipped' },
});
check('confirmed -> shipped works', ship1.status === 200);

const tooEarlyDeliver = await api('PATCH', `/orders/${order1._id}/status`, {
  token: brandA.token,
  body: { status: 'delivered' },
});
check('shipped -> delivered allowed', tooEarlyDeliver.status === 200 && tooEarlyDeliver.json.data.order.status === 'delivered');

const cancelDelivered = await api('PATCH', `/orders/${order1._id}/status`, {
  token: brandA.token,
  body: { status: 'cancelled' },
});
check('delivered order cannot be cancelled', cancelDelivered.status === 400);
check('delivered order stock untouched', (await stockOf(pA.product._id)) === 1);

// ------------------------------------------------- CANCEL + RESTOCK --------
const pCancel = await createProduct(brandA, { name: 'Cancel Test', stock: 5 });
const toCancel = await placeOrder(customer1, [
  { product: pCancel.product._id, quantity: 3 },
]);
const cancelOrderId = toCancel.json.data.orders[0]._id;
check('cancel-test stock reserved', (await stockOf(pCancel.product._id)) === 2);

const cancel1 = await api('POST', `/orders/${cancelOrderId}/cancel`, {
  token: customer1.token,
});
check('customer cancels pending order', cancel1.status === 200 && cancel1.json.data.order.status === 'cancelled');
check('cancel restores stock', (await stockOf(pCancel.product._id)) === 5);

const cancel2 = await api('POST', `/orders/${cancelOrderId}/cancel`, {
  token: customer1.token,
});
check(
  'double cancel is a no-op success',
  cancel2.status === 200 && cancel2.json?.data?.alreadyCancelled === true
);
check('double cancel does not double-restock', (await stockOf(pCancel.product._id)) === 5);

const cancelOther = await api('POST', `/orders/${idem1.json.data.orders[0]._id}/cancel`, {
  token: customer2.token,
});
check('other customer cannot cancel', cancelOther.status === 403);

// Brand-side cancel restores stock too.
const pBrandCancel = await createProduct(brandA, { name: 'Brand Cancel', stock: 10 });
const brandCancelOrder = await placeOrder(customer2, [
  { product: pBrandCancel.product._id, quantity: 4 },
]);
const brandCancelId = brandCancelOrder.json.data.orders[0]._id;
check('brand-cancel stock reserved', (await stockOf(pBrandCancel.product._id)) === 6);
await api('PATCH', `/orders/${brandCancelId}/status`, {
  token: brandA.token,
  body: { status: 'confirmed' },
});
const brandCancel = await api('PATCH', `/orders/${brandCancelId}/status`, {
  token: brandA.token,
  body: { status: 'cancelled' },
});
check('brand cancels confirmed order', brandCancel.status === 200);
check('brand cancel restores stock', (await stockOf(pBrandCancel.product._id)) === 10);

// ------------------------------------------------------------- STATS ------
const brandC = await signup('brand', 'Brand C');
const pC = await createProduct(brandC, { name: 'Stats Product', price: 25, stock: 20 });
const statsOrder1 = await placeOrder(customer1, [
  { product: pC.product._id, quantity: 2 },
]);
const statsOrder2 = await placeOrder(customer1, [
  { product: pC.product._id, quantity: 1 },
]);
await api('POST', `/orders/${statsOrder2.json.data.orders[0]._id}/cancel`, {
  token: customer1.token,
});

const stats = await api('GET', '/orders/brand/stats', { token: brandC.token });
check('brand stats total orders', stats.status === 200 && stats.json.data.totalOrders === 2);
check('brand stats revenue excludes cancelled', stats.json.data.revenue === 50);
check('brand stats byStatus', stats.json.data.byStatus.pending === 1 && stats.json.data.byStatus.cancelled === 1);

// --------------------------------------------------------- CONCURRENCY ----
const pRace = await createProduct(brandA, { name: 'Race Product', stock: 10 });
const attempts = await Promise.all(
  Array.from({ length: 15 }, () =>
    placeOrder(customer2, [{ product: pRace.product._id, quantity: 1 }])
  )
);
const wins = attempts.filter((r) => r.status === 201).length;
const losses = attempts.filter((r) => r.status === 400 || r.status === 409).length;
const finalStock = await stockOf(pRace.product._id);
check('concurrent oversell prevented', wins === 10 && losses === 5);
check('concurrent stock never negative', finalStock === 0);

// Concurrent retries with the same idempotency key create exactly one order.
const pIdemRace = await createProduct(brandA, {
  name: 'Idem Race',
  stock: 5,
});
const raceKey = `race-${unique()}`;
const idemRace = await Promise.all(
  Array.from({ length: 6 }, () =>
    api('POST', '/orders', {
      token: customer2.token,
      headers: { 'Idempotency-Key': raceKey },
      body: {
        items: [{ product: pIdemRace.product._id, quantity: 1 }],
        shippingAddress: address,
      },
    })
  )
);
const idemRaceOrders = await OrderModel.countDocuments({
  idempotencyKey: raceKey,
});
check(
  'concurrent idempotent retries create one order',
  idemRaceOrders === 1
);
check(
  'concurrent idempotent retries decrement stock once',
  (await stockOf(pIdemRace.product._id)) === 4
);
check(
  'concurrent idempotent retries all return success',
  idemRace.every((r) => r.status === 200 || r.status === 201)
);

// A cancelled order releases its idempotency key, so a genuine retry after
// cancellation places a new order instead of replaying the cancelled one.
const replayKey = `replay-${unique()}`;
const replayFirst = await api('POST', '/orders', {
  token: customer2.token,
  headers: { 'Idempotency-Key': replayKey },
  body: {
    items: [{ product: pIdemRace.product._id, quantity: 1 }],
    shippingAddress: address,
  },
});
await api('POST', `/orders/${replayFirst.json.data.orders[0]._id}/cancel`, {
  token: customer2.token,
});
const replaySecond = await api('POST', '/orders', {
  token: customer2.token,
  headers: { 'Idempotency-Key': replayKey },
  body: {
    items: [{ product: pIdemRace.product._id, quantity: 1 }],
    shippingAddress: address,
  },
});
check(
  'retry after cancellation creates a new order',
  replayFirst.status === 201 &&
    replaySecond.status === 201 &&
    replaySecond.json.data.orders[0]._id !== replayFirst.json.data.orders[0]._id
);

// Brand product list validation (previously 500 on negative page).
const badBrandPage = await api('GET', '/products/brand/all?page=-3', {
  token: brandA.token,
});
check('negative brand product page rejected', badBrandPage.status === 400);

// ----------------------------------------------------------- CLEANUP ------
const failed = results.filter(([s]) => s === 'FAIL');
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);

await mongoose.connection.dropDatabase();
await mongoose.connection.close();
server.close();
process.exit(failed.length > 0 ? 1 : 0);
