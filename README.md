# CoolRoadmap
> [Project Description]

## Getting started

Add `dist/CoolRoadmap.min.js` and `dist/CoolRoadmap.min.css` to your project and your html file and create a new roadmap with some columns and milestones.

```html
<link rel="stylesheet" href="CoolRoadmap.min.css">
<script src='CoolRoadmap.min.js'></script>

<script>
    var myroadmap = new roadmap('CoolRoadmapWrapper');

    myroadmap.columns([
        'Column 1',
        'Column 2'
    ])

    myroadmap.milestones([
        {
            title: 'Rank 0 - col 1',
            description: 'Discriptive text',
            belongsToColumn: 1,
            rank: 0
        },
        {
            title: 'Rank 0 - col 2',
            description: 'Discriptive text',
            belongsToColumn: 2,
            forwardConnect: [1, 1],
            rank: 1
        }
    ])
</script>
```

## API

```javascript
var myroadmap = new roadmap('idForWrapperDiv');
```

### roadmap.columns(columns)

Create the columns for the roadmap. The `columns` argument if an array of string column titles.

```javascript
myroadmap.columns([
    'Column 1',
    'Column 2'
])
```

### roadmap.milestones(milestones)

Create the columns for the roadmap. The `milestones` argument is an object containing the data for the milestone. The object structure is defined as:

```javascript
{
    title: // Milestone title
    description: // Milestone descriptive text to be shown on click
    belongsToColumn: // The column number that the milestone belongs to (starts at 1)
    forwardConnect: [
        // The column of the node this node connects to,
        // The node index (starts at 1) of the node this node connects to
    ]
    rank: // The order in which this node should appear in the column (0 is the bottom and lowest rank)
}
```

```javascript
myroadmap.milestones([
    {
        title: 'Rank 0 - col 1',
        description: 'Discriptive text',
        belongsToColumn: 1,
        rank: 0
    }
])
```

### roadmap.style(columnColors)

Define the colors for the nodes in each column. The `columnColors` argument is an array of strings containing the color (hex or rgb) for each defined column.

```javascript
myroadmap.columnColors(['#6a4bcc', '#04a2fa', '#e7327d', '#662b6b'])
```

## Features

* Create a nice roadmap to show for yourn projects
* Connect roadmap items across columns
* Simple to style each node

## Licensing

[NEED LICENSE]