# cpd-pkg

> npm package of [custom-protocol-detection](https://github.com/ismailhabib/custom-protocol-detection).

# Explain

the lib is npm package of custom-protocol-detection. you can use it check custom protocol whether installed in your device. If protocol is installed, it will be launch via broswer.

this is online demo. It will open your eamil app. [try]() 

# Install

`npm i custom-protocol-detection-pkg`

# Usage

```js
import cpd from "custom-protocol-detection-pkg";

cpd(
  "mailto:johndoe@somewhere.com",
  () => {
    console.log("failed")
  },
  () => {
    console.log("successed")
  },
  () => {
    console.log("unsupported")
  }
);
```

# License

MIT [@hemengke1997](https://github.com/hemengke1997)
