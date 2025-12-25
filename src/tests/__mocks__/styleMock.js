const styleMock = new Proxy({}, {
    get: (target, prop) => prop,
});
export default styleMock;
