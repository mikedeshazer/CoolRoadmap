# CoolRoadmap

![4 Column With Progress Bar](_images/4colWithBarExample.png?raw=true "4 Column With Progress Bar")

[1 Column Example](https://htmlpreview.github.io/?https://github.com/mikedeshazer/CoolRoadmap/blob/master/demo/ex1.htm) &bull; 
[2 Column Example](https://htmlpreview.github.io/?https://github.com/mikedeshazer/CoolRoadmap/blob/master/demo/ex2.htm) &bull; 
[3 Column Example](https://htmlpreview.github.io/?https://github.com/mikedeshazer/CoolRoadmap/blob/master/demo/ex3.htm) &bull; 
[4 Column Example](https://htmlpreview.github.io/?https://github.com/mikedeshazer/CoolRoadmap/blob/master/demo/ex4.htm) &bull; 
[10 Column Example](https://htmlpreview.github.io/?https://github.com/mikedeshazer/CoolRoadmap/blob/master/demo/ex5.htm)

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
            descriptionHTML: 'Discriptive text',
            belongsToColumn: 1,
            rank: 0
        },
        {
            title: 'Rank 0 - col 2',
            descriptionHTML: 'Discriptive text',
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
    descriptionHTML: // Milestone descriptive text/HTML to be shown on click
    belongsToColumn: // The column number that the milestone belongs to (starts at 1)
    forwardConnect: [
        // The column of the node this node connects to,
        // The milestone rank of the node this node connects to
    ]
    rank: // The order in which this node should appear in the column (0 is the bottom and lowest rank)
    difficult: // The amount of which this milestone contributes to the percent complete
    status: // If defined as "complete" this milestone is marked as complete
}
```

```javascript
myroadmap.milestones([
    {
        title: 'Rank 0 - col 1',
        descriptionHTML: '<strong>HTML is even supported</strong>',
        belongsToColumn: 1,
        rank: 0,
        difficult: 10
    }
])
```

### roadmap.style(columnColors)

Define the colors for the nodes in each column. The `columnColors` argument is an array of strings containing the color (hex or rgb) for each defined column.

```javascript
myroadmap.columnColors(['#6a4bcc', '#04a2fa', '#e7327d', '#662b6b'])
```

### roadmap.markComplete(milestonesComplete)

Define which milestones are complete to drive the percent complete of the column. The `milestonesComplete` argument is an array of arrays of integers of which are the ranks that are complete for each column.

```javascript
myroadmap.columnColors([
    [0, 3], // Column 1 - Rank 0 and 3
    [2] // Column 2 - Rank 2
])
```


## Features

* Create a nice roadmap to show for yourn projects
* Connect roadmap items across columns
* Simple to style each node
* Overall progress bar