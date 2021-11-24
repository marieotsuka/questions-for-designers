# Questions for Designers

This site compile responses from various designers to a series of interview questions.


## Compilation
Files are compiled via the static site generator [11ty](https://www.11ty.dev/docs/).
There are custom scripts built into the `package.json` file that manages both `sass` processing and site generation.

- Compile locally via `npm run serve`
The site should be loaded up and listening to changes on `http://localhost:8080`

- Compile for production via `npm run build`
Use this command prior to pushing to Github. We use Github Pages to host the compiled files in the output `docs` folder.

## Content

The content for the site is stored in a few different formats to allow for flexible navigation.

Note: `.md` files, unless marked with `permalink: false`, will generate an output.
On the other hand, `.json` files do not automatically generate an output, unless tied to a template file that specifies an output format.

### Questions
Questions are managed in a global data folder (`_data`) in the `questions.json` file.
Each question requires an `id` and `title`.

`id`: key for this question. This id is used to link responses to their respective question.
`title`: the question text. Although there may have been slight variations in the questions asked depending on the designer, but we will be displaying the same text for each, so we may need to rephrase some questions so that they work across the responses.

```json
{
	"id": 2,
	"title": "How did you get started with interactive design?"
},
```

### Responses
Responses are grouped by designer in each designer folder.
Each folder consists of the following files:

- `index.md`
This file ensures that the designer page is published. It is the same for all folders.

- `designer-name.json`
This file contains the meta data for each designer in `json` format.

```json
{
	"name": "Hyperlink Press",
	"symbol": "🏄",
	"color": "0055ff"
}
```

`name`: Name of the designer
`symbol`: The emoji they picked
`color`: The hex code of their color (without the `#`)

- Response files (`r1.md`, `r2.md`, etc.)
Each response is stored in its own `md` file. The following frontmatter is required for all files.

```yaml
---
tags: response
permalink: false
id: 2
---
```

`tags`: This should always be `response`. This makes sure that the response can be queried with this tag.
`permalink`: This should always be `false`. This signals that each response does not need its own page generated.
`id`: This is the numerical key that corresponds to the relevant question, assigned in the `_data/questions.json` file. The `id` is also responsible for ordering the responses in the `designer` view. Image slides, for example, may not correspond to a particular question, but can be inserted in-between slides with a number between them (i.e. `1.1`, `1.2`)


## Templates and Outputs

While 11ty supports various template languages, we use [liquid](https://shopify.github.io/liquid/basics/introduction/) here.
Some liquid features are not available in 11ty, but the core mechanics, such as variable assignment, iteration, control flow should work according to the documentation.

There are several ways data is manifested in the template layouts.


### Homepage
The homepage layout is determined by `index.liquid`.
It loops through the questions and designers and lists them.

### Question view
The collection of responses to a particular question uses the layout `question.liquid`.
It filters all responses by the question id, and lists them. (Currently in alphabetical order of the designer name; perhaps this can be randomized.)

Each question page is generated into the output folder determined by the `permalink` frontmatter, as `questions/q{{ question.id }}/`. 

### Designer view
The collection of responses by a particular designer uses the layout in `_layouts/designer.liquid`.
It filters all responses by the designer name, and displays them in order of the response `id`s.

Each designer page is genrated into the output folder `designers/name-of-designer/`.



