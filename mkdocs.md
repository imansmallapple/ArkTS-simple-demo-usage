# Mkdocs usage

This tutorial is based on Windows system

## Prerequisites

`Python 3.12`, `pip`, `vs code`, `github account`

## Initial Installation

```python
python -m venv venv
```

```bash
.\venv\Scripts\activate
```

```bash
pip install mkdocs-material
```

**Create mkdocs site**
```bash
mkdocs new .
```

**Add basic configuration for material theme into mkdocs.yml file**
```bash
site_name: My MkDocs Material Documentation
site_url: https://sitename.example
theme:
 name: material
```

```bash
mkdocs serve
```
You can find the rendered site on your local server now.

## MkDocs scheme validation

Install yaml from `RED HAP` in extension tab in vscode.
Add following into YAML extension settings in JSON format
```json
    "yaml.schemas": {
        "https://squidfunk.github.io/mkdocs-material/schema.json": "mkdocs.yml"
      },
      "yaml.customTags": [
        "!ENV scalar",
        "!ENV sequence",
        "!relative scalar",
        "tag:yaml.org,2002:python/name:material.extensions.emoji.to_svg",
        "tag:yaml.org,2002:python/name:material.extensions.emoji.twemoji",
        "tag:yaml.org,2002:python/name:pymdownx.superfences.fence_code_format"
      ]
```

## Setting the color scheme

**Change color scheme**

```bash
theme:
 name: material
 palette: 
   scheme: slate # Background
   primary: green # Top Bar and link
   accent: deep purple # link touch color
```

**Add a toggle**
Paste the following code into palette:
```bash
 palette: 
   # Dark mode
  - scheme: slate
    toggle:
     icon: material/weather-sunny
     name: Dark mode
    primary: green
    accent: deep purple

  # Light mode
  - scheme: default
    toggle:
      icon: material/weather-night
      name: Light mode
    primary: blue
    accent: deep orange
```

## Setting the font
Paste the following code uder theme name
```bash
theme:
 name: material
 font:
  text: Merriweather Sans
  code: Red Hat Mono # Change font in code
```

## Setting Emoji
We can search wanted emoji in mkdocs material and find the command

https://squidfunk.github.io/mkdocs-material/reference/icons-emojis/

To enable emoji, add the following code in yaml file:

```bash
markdown_extensions:
  - attr_list
  - pymdownx.emoji:
      emoji_index: !!python/name:material.extensions.emoji.twemoji
      emoji_generator: !!python/name:material.extensions.emoji.to_svg
```

 You can also change the theme logo use your own image:
 ```bash
  font:
  text: Merriweather Sans
  code: Red Hat Mono # Change font in code
 logo: assets/oniro.png
 ```
 Also change the favorite icon for the site.
 Simply change the image name and do the following:
 ```bash
  font:
  text: Merriweather Sans
  code: Red Hat Mono # Change font in code
 logo: assets/oniro.png
 favicon: assets/favicon.png
 ```

 ## Code Blocks
 Paste the following under markdown_extensions:
 ```bash
   - pymdownx.highlight:
      anchor_linenums: true
      line_spans: __span
      pygments_lang_class: true
  - pymdownx.inlinehilite
  - pymdownx.snippets
  - pymdownx.superfences
 ```
We can find the source of `Pigment` [here](https://pygments.org/docs/lexers/#lexers-for-javascript-and-related-languages)

Add title:
```py title="add_numbers.py" linenums="1" hl_lines="2-4"
# Function to add two numbers
def add_two_numbers(num1, num2):
    return num1 + num2

# Example usage
result = add_two_numbers(5, 3)
print('The sum is:', result)
```

## Content Tabs
```
markdown_extensions:
  - pymdownx.superfences
  - pymdownx.tabbed:
      alternate_style: true
```

Example for different code blocks:

```bash
### Code Blocks in Content Tabs

=== "Python"

    ```py
    def main():
        print("Hello world!")

    if __name__ == "__main__":
        main()
    ```

=== "JavaScript"

    ```js
    function main() {
        console.log("Hello world!");
    }

    main();
    ```
```

## Add admonitions
