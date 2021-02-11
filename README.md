# Devbook Extension
Devbook extensions allow users to add search sources that aren’t supported out-of-the-box by Devbook. It’s like a programmable search engine.

Your extension doesn’t have to implement the search logic or any user interface. You only have to do two things:
1) Upload the search data into Devbook's search engine and keep them up-to-date.
2) React to user events in the Devbook app.

For uploading extension's search data into Devbook's search engine, use [Devbook Extension Admin API](https://github.com/DevbookHQ/devbook-extension-admin-node).

## Installation
```
npm install @devbookhq/extension
or
yarn add @devbookhq/extension
```

## Usage
```js
import Devbook, { ExtensionEventHandlers } from '@devbookhq/extension';

// If you want to use our predefined functions to fetch extension data, you have to initialize the Devbook object.
const devbook = new Devbook();

const extensionEventHandlers: ExtensionEventHandlers = {
  // Called every time user changes the search query in the Devbook search input.
  onDidQueryChange: async (data, extensionMode, token) => {
    // Mock example not fetching any data from the extension data.
    const results = [
      {
        id: '1',
        title: 'Hello World!',
        body: `The search query was ${data.query}`,
      },
    ];
    return { results };

    // Fetch your extension data from the https://api.usedevbook.com/:version/extension/:extensionID endpoint.
    // You can use our exported predefined functions for that:

    // const results = await devbook.search(['testIndex'], data.query);
    // return { results };
  },
}

export default extensionEventHandlers;
```

## Documentation
TODO: Add a link to documentation.

[Read the extension guide](https://docs.google.com/document/d/1XD0LJBnSRSo0CpJCKIi7K7dwSGi-USF6Bu0P-VKyeAo/edit#).

## Examples
Check out the [extension examples](https://github.com/DevbookHQ/devbook-extension-examples).
