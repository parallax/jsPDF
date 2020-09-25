# Contribution Guidelines

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

## Code of Conduct

This project and everyone participating in it is governed by the
[Code of Conduct](https://github.com/MrRio/jsPDF/blob/master/CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report unacceptable behavior to
[james@parall.ax](mailto:james@parall.ax).

## How Can I Contribute?

jsPDF is an open source project and requires help from the community. Any contributions from the community are very
much welcome! Be it "only" reporting bugs or actually contributing code to the repository.

### Reporting Bugs

jsPDF is by no means perfect. If you find something is not working as expected we are glad to receive an
issue report from you. Please make sure to
[search for similar issues](https://github.com/search?q=is%3Aissue+repo%3AMrRio%2FjsPDF&type=issues) first.

If you did not find any related issues, please report a [new issue](https://github.com/MrRio/jsPDF/issues).
In order to be able to react efficiently we ask you to provide us with the following information:

- The **version** of jsPDF you are using
- A small code example that reproduces the issue ([mcve](https://stackoverflow.com/help/mcve))

Please also abide to these rules:

- Formulate the issue in English.
- Provide a **clear and descriptive** title
- Stick to the issue template
- Make sure code is properly indented and
  [formatted](https://help.github.com/articles/basic-writing-and-formatting-syntax/#quoting-code) (Use ``` around
  code blocks). Attach large code snippets as file.

Note that this is an open source project and don't expect us to fix every issue immediately. Please also consider
fixing the issue yourself and preparing a pull request. Sometimes a pointer to a specific line of code already helps
a lot. We will happily discuss and merge contributions from the community!

### Pull requests

We are very happy about pull requests from the community and will discuss and merge them in a timely manner. When
preparing a pull request please follow these guidelines:

- You can find instructions for building and testing jsPDF [below](#building-and-testing-jspdf)
- Make sure to cover new features or bugs with test cases. Test cases should be as small as possible.
- Make sure to follow the PDF specification. JsPDF currently implements part of the PDF 1.3 specification.
- Make sure all tests are green before committing (`npm run test-local`)
- Use only es5-compatible code in the `src` folder (except for import/export statements). The sources are currently
  not babeled. When using newer EcmaScript or Browser APIs make sure the required polyfills are listed in
  `src/polyfills.js`.
- Run `npm run prettier` before committing.
- For the commit message, follow these guidelines:
  - Use the present tense ("Add feature" not "Added feature")
  - Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
  - Limit the first line to 72 characters or fewer
  - Reference issues and pull requests liberally after the first line
- Make sure the CI tests are green after pushing. If not, please fix them.

### Building and Testing jsPDF

You can build the library with `npm install && npm run build`. This will fetch all dependencies and then compile the `dist`
files. To see the examples locally you can start a web server with `npm start` and go to `localhost:8000`.

To test locally, run

```sh
npm run test-unit # will run only unit tests
# or
npm run test-local # will also run deployment tests for different module formats using the files in the dist folder
```

The tests live in the `test` folder and are a set of `specs` that sometimes compare the result with checked-in
reference PDF files. New reference PDFs can be created by running `npm run test-training` in the background.

Alternatively, you can build jsPDF using these commands in a readily configured online workspace:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io#https://github.com/MrRio/jsPDF)
