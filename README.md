# Questions for Designers

This site compile responses from various designers to a series of interview questions.


## Compilation
Files are compiled via the static site generator [11ty](https://www.11ty.dev/docs/).
There are custom scripts built into the `package.json` file that manages both `sass` processing and site generation.

- Compile locally via `npm run serve`
The site should be loaded up and listening to changes on `http://localhost:8080`

- Compile for production via `npm run build`
Use this command prior to pushing to Github. We use Github Pages to host the compiled files in the output `docs` folder.

## General file structure

| Folder | Description |
| --- | ----------- |
| `src` | Input folder, containing content and layout templates |
| `docs` | Output folder, containing the generated HTML files |
| `.eleventy.js` | 11ty configuration file. This file also contains the custom filters to gather and sort the various data sources |


## Content

The content for the site is stored in a few different formats to allow for flexible navigation.

Note: `.md` files, unless marked with `permalink: false`, will generate an output.
On the other hand, `.json` files do not automatically generate an output, unless tied to a template file that specifies an output format.

### Questions
> Location: `src/_data/questions.json`

- **Data file** `questions.json` This file lists all of the questions. Each question requires an `id` and `title`.

```json
{
	"id": 2,
	"title": "How did you get started with interactive design?"
},
```

| Key | Description |
| --- | ----------- |
| `id` | key for this question. This `id` is used to link responses to their respective question. The data file array should also be ordered by the `id`. |
| `title` | the question text. Although there may have been slight variations in the questions asked depending on the designer, but we will be displaying the same text for each, so we may need to rephrase some questions so that they work across the responses.|


### Responses
> Location: `src/designers`

Responses are grouped by the designer (slug) in each designer folder.
Each folder consists of the following files:

- **Index file** `index.md` This file ensures that the designer page is published. It is the same for all folders.

- **Data file** `designer-name.json` This file contains the meta data for each designer in `json` format.

```json
{
	"name": "Hyperlink Press",
	"symbol": "????",
	"color": "0055ff"
}
```

| Key | Description |
| --- | ----------- |
| `name` | Name of the designer |
| `symbol` | The emoji they picked |
| `color` | The hex code of their color (without the `#`) |

- **Response files** (`r1.md`, `r2.md`, etc.) Each response is stored in its own `md` file. The following frontmatter is required for all files.

```yaml
---
tags: response
permalink: false
id: 2
---
```

| Key | Description |
| --- | ----------- |
|`tags` | This should always be `response`. This makes sure that the response can be queried with this tag.|
|`permalink` | This should always be `false`. This signals that each response does not need its own page generated.|
|`id`| This is the numerical key that corresponds to the relevant question, assigned in the `_data/questions.json` file. The `id` is also responsible for ordering the responses in the `designer` view. Image slides, for example, may not correspond to a particular question, but can be inserted in-between slides with a number between them (i.e. `1.1`, `1.2`)|


## Templates and Outputs

While 11ty supports various template languages, we use [liquid](https://shopify.github.io/liquid/basics/introduction/) here.
Some liquid features are not available in 11ty, but the core mechanics, such as variable assignment, iteration, control flow should work according to the documentation.

There are several ways data is manifested in the template layouts.


### Homepage
> Layout file: `src/index.liquid`

This is the site index. It loops through the questions and designers and lists them.

### Question view
> Layout file: `src/question.liquid`

The collection of responses to a particular question. 
It filters all responses by the question id, and lists them. (Currently in alphabetical order of the designer name; perhaps this can be randomized.)

Each question page is generated into the output folder determined by the `permalink` frontmatter of the layout file, as `questions/q{{ question.id }}/`, i.e. `questions/q1/index.html`, `questions/q2/index.html` ...

### Designer view
> Layout file: `_layouts/designer.liquid`

The collection of responses by a particular designer. It filters all responses by the designer name, and displays them in order of the response `id`s.

Each designer page is genrated into the output folder `designers/name-of-designer/`, i.e. `designers/hyperlink-press/index.html` ...



