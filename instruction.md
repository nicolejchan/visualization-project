--- 

layout: default
title: lab10

---

# <img src="img/instruction/logo.png" width="30px"> CSCI339001 Visualization


# Lab 10


## Learning Objectives

- Learn the very basics of Vega-lite.

### Prerequisites

- Read [https://vega.github.io/vega-lite/tutorials/getting_started.html](https://vega.github.io/vega-lite/tutorials/getting_started.html)
- Accept the lab assignment invitation from Github Classroom: 
	[https://classroom.github.com/a/PsIpuXEK](https://classroom.github.com/a/PsIpuXEK)


## Instruction

Vega-lite allows you to create a chart configuration using a JSON specification. It uses the visual encoding vocabulary we learned throughout our lectures, including data transforms (e.g., filter and aggregate), visual marks (e.g., bar, line, circle), and encoding channels (e.g., position and color), as well as other chart elements such as scales and axes. Therefore, a lot of keywords used in this library should be already familiar to you. 



In this simple lab, you will recreate the bar chart you had in Lab 5. Here is a likely result of this lab:

![Lab 10 - Preview](img/instruction/lab10-preview.gif?raw=true "Lab 10 - Preview")



We already set up a template code that includes data loading as well as handling the selection. You only need to write a Vega-lite specification that generates the bar chart. 

The tricky part is that you need to choose a different column in the data depending on the selection. Unfortunately, this is not possible with the current version of Vega-lite that only supports filtering values within a column through [input binding](https://vega.github.io/vega-lite/examples/interactive_query_widgets.html). 

Therefore, you need to get the selected value (either stores and revenue) and use it to specify the y-field:


```javascript
let column = document.querySelector(".select-control").value;

{
    ...
    y:{field:column,type:"quantitative"},
    ...
}

```

Everything else should be straightfoward. You should be able to complete this within the class time.

Also, make sure to sort the bar. Take a look at the documentation here for help: [https://vega.github.io/vega-lite/docs/sort.html](https://vega.github.io/vega-lite/docs/sort.html).


If you happen to finish this lab early, please feel free to create other charts using datasets from previous labs. We included all the datasets in the template. Please keep in mind that we had to change the format of some data sets to fit in Vega-lite.

1. [Lab 4](https://bcviscourse.github.io/lab4/instruction): use `wealth-health-2014.csv`
2. [Lab 6](https://bcviscourse.github.io/lab6/instruction): use `per_category.csv`
3. [Lab 7](https://bcviscourse.github.io/lab7/instruction): use `airports.json`, `connections.json`, and `world-110m.json`

Keep in mind that Vega-lite is still very experimental. For instance, it could not handle the nested JSON data from Lab 7 that contains both nodes and links. So we separated then into two files: `airports.json` (nodes), `connections.json` (links).


Here are what I created:
![Lab 10 - All](img/instruction/lab10-all.gif?raw=true "Lab 10 - All")

You need to frequently refer to the official documentation as there is no Vega-lite book yet! 


### Submission of lab 

Please submit the **Github Pages url**, as well as **the link to the repository**, to Canvas.

Thanks!
