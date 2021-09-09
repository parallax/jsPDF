Tests
=====

To run these tests, run:

```
npm test
```

To run locally, do:

```
npm run test-local
```

Training mode
-------------

If a reference PDF doesn't exist it will be created if you run this command
while the tests run:

```
node test/utils/reference-server.js
```

This generates and collects reference PDFs from real browsers. This should be
done before refactoring a plugin or component to ensure output is exactly
identical.

This will in future also allow us to create reference images to compare against
visually.
