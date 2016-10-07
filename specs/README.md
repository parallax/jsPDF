Specs
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

There's a training mode that can be enabled. Currently this is done by changing 'training' to true in specs/utils/compare.js and running the following command:

```
node specs/utils/reference-server.js
```

This generates and collects reference PDFs from real browsers. This should be done before refactoring a plugin or component to ensure output is exactly identical.

This will in future also allow us to create reference images to compare against visually.
