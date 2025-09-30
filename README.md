<img src="./TailcompLogo.png" alt="Tailcomp" width="200px" height="200px" style="margin-inline: auto;" />

# Tailcomp | The TailwindCSS Composer

![License](https://img.shields.io/github/license/KeeghanM/tailcomp)
![GitHub package.json version](https://img.shields.io/github/package-json/v/KeeghanM/tailcomp)
![GitHub last commit](https://img.shields.io/github/last-commit/KeeghanM/tailcomp)

Welcome to Tailcomp, the intuitive TypeScript library designed to make composing Tailwind CSS classes simpler and more efficient. Tailcomp leverages the power of Tailwind CSS, while enabling developers to define their styles in a structured, JavaScript object format. Say goodbye to long, hard-to-read class strings and hello to a cleaner, more organized approach to styling your projects - all with TypeScript powered AutoComplete!

**_This_**

```javascript
<div className='flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'>
  /* ... */
</div>
```

**_Becomes_**

```javascript
<div className={tc({
    base: {
        static: "flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow",
        hover: "bg-gray-100",
        dark: {
            static: "border-gray-700 bg-gray-800",
            hover: "bg-gray-700"
        }
    },
    md: {
        static: "flex-row max-w-xl"
    },
})}>
```

_Credit to Flowbite for the [card example](https://flowbite.com/docs/components/card/)._

![Mindblown GIF](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTltMzl2NXd4bnA5eWdrNXo3djllemFneGxnNmxwYnUzdWh5Zms2NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lXu72d4iKwqek/giphy.gif)

## Introduction

Tailwind CSS has revolutionized the way we think about writing CSS, offering a utility-first approach that speeds up the development process as well as allowing for smaller bundle sizes. However, as projects grow, managing those utility classes can become cumbersome. Tailcomp aims to solve this by providing a simple yet powerful function, `tc()`, that lets you compose and manage Tailwind classes more elegantly.

By maintaining a consistent pattern of Media Query > Colour Scheme > Dynamic Style (hover, focus etc), you are able to easily and quickly identify what classes will be affecting what. This focus on clarity will make not only the DX (Developer Experience) better, but also other (often forgotten) elements of development like Code Reviews much smoother as well!

## Install steps

### The following steps are for Next.js projects, but can be adapted to other frameworks as well.

1. Ensure you have TailwindCSS installed in your project already
   1. Refer to the [TailwindCSS Documentation](https://tailwindcss.com/docs/installation) for installation instructions
2. Install Tailcomp

`npm -i tailcomp` or `yarn add tailcomp`

3. Because Tailcomp uses a prebuild step to generate the classes, you will need to add a prebuild script to your package.json

```
"scripts": {
    "prebuild": "node ./node_modules/tailcomp/dist/cjs/generate-classes.js",
}
```

4. This generates a file with all your Tailwind classes in the `src/styles` directory. You will need to include this file in your `tailwind.config.js` file under `content`
   1. `content: ["./src/**/*.tsx", "./src/styles/tailcomp.js"]`
   2. We also recommend you add this file to your .gitignore, as it will be generated on the fly

5. During development, you're going to want to watch for changes to your `src` directory and regenerate the classes file. We recommend using `nodemon` for this, which you can install using

`npm install --save-dev nodemon` or `yarn add -D nodemon`

6. Now, alter your `dev` script in your `package.json` to include the `prebuild` step and watch for changes to your `src` directory
   1. Note that you will need to ignore the `tailcomp.js` file, to avoid an infinite loop of generating the classes file

```
"scripts": {
    "dev": "nodemon --watch \"src/**/*.*\" --ignore \"src/styles/tailcomp.js\" --exec \"npm run prebuild && next dev\"",
}
```

\*Note: The above example is for NextJS. Make sure your final dev script matches your existing dev script. For example, `astro dev`

7. Finally, you can import the `tc` function and start using it in your components!
   1. See the [Basic Usage](#basic-usage) section below for more information

**_You running to try out Tailcomp_**

![Muppets running GIF](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbW82NTU4aGZhZHo3aWZxNjBwNGFybWcyMDd6ZGlnOWpmMnVwZHRoOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7kn27lnYSAE9O/giphy.gif)

## Key Features

1. **TypeScript Support**: Tailcomp is written in TypeScript and comes with its own types, so you can enjoy the benefits of static typing and autocompletion.
2. **Intuitive API**: Tailcomp's API is designed to be simple and easy to use, with a focus on clarity and readability.
3. **Utilises Tailwind CSS**: Tailcomp is built as an extension of Tailwind CSS, so you can continue to use all of Tailwind's utility classes inside Tailcomp.
4. **PreBuild Step**: Tailcomp uses a prebuild step to generate all the Tailwind classes so that TailwindCSS can _do it's thang_ and tree-shake the unused classes.

## Basic Usage

As shown in the example above, you can use the `tc()` function to compose your Tailwind classes. The function takes an object as its argument, with the keys representing the breakpoints and the values representing the classes you want to apply at those breakpoints.

You have access to the following breakpoints at the top level:

- `base`: The base classes that will be applied to all breakpoints
- `sm`: The small breakpoint `@media (min-width: 640px) { ... }`
- `md`: The medium breakpoint `@media (min-width: 768px) { ... }`
- `lg`: The large breakpoint `@media (min-width: 1024px) { ... }`
- `xl`: The XL breakpoint `@media (min-width: 1280px) { ... }`
- `2xl`: The 2XL breakpoint `@media (min-width: 1536px) { ... }`

Beneath these you can use any of the psuedo-classes, some examples of these are:

- `static`: The classes that will be applied by default
- `hover`: The classes that will be applied on hover
- `active`: The classes that will be applied on active
- `focus`: The classes that will be applied on focus

For a full list, see TailWinds [pseudo-class reference](https://tailwindcss.com/docs/hover-focus-and-other-states#pseudo-class-reference)

- `dark`: The classes that will be applied when the dark mode is active
  - `dark` is a special key that can be used to define classes that will be applied when the dark mode is active. You can nest `static`, `hover`, `active` etc. keys beneath it to define the classes you want to apply at each state. Or, define `dark` as a string if there are no specific dynamic + dark styles.

```javascript

// Import the tc function
import tc from "tailcomp";

// Use the tc function to compose your Tailwind classes

<div className={tc({
    base: {
        static: "flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow",
        hover: "bg-gray-100",
        dark: "border-gray-700 bg-gray-800",
    },
    lg: {
        static: "flex-row max-w-xl"
    }
})}>
```

And because this is simply built on top of Tailwind, you can pick and choose when to use Tailcomp and when to use Tailwind directly. This means you can slowly migrate your codebase over to Tailcomp, or use it for specific components that are particularly complex.

If all you're applying is one or two static classes, with maybe even one hover class, then you might not need to use Tailcomp at all. But as soon as you start adding more and more classes, Tailcomp will start to shine.

## Get Involved

Tailcomp is an open-source project, and contributions are welcome. Whether you're looking to fix a bug, add a new feature, or improve the documentation, your help is appreciated.

## Stay Connected

For updates, follow me on Twitter: [@keeghanmcg](https://twitter.com/keeghanmcg)

---

Tailcomp is licensed under [MIT](https://mit-license.org/). Feel free to use, share, and contribute back!
