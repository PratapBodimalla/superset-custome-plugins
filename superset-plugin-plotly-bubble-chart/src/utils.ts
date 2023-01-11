import { CategoricalColorNamespace, PlainObject } from "@superset-ui/core";
import { SliderStep } from "plotly.js";
import { AddWhenType, ConvertToBubbleChartType } from "./types";

export const ConvertToBubbleChart = ({
  data,
  formData,
  width = 500,
  height = 600,
}: ConvertToBubbleChartType) => {
  var lookup: PlainObject = {};

  function getData(year: string, continent: string) {
    var byYear, trace;
    if (!(byYear = lookup[year])) {
      byYear = lookup[year] = {};
    }

    if (!(trace = byYear[continent])) {
      trace = byYear[continent] = {
        x: [],
        y: [],
        id: [],
        text: [],
        marker: { size: [], color: [] },
      };
    }

    return trace;
  }

  const colorScale = CategoricalColorNamespace.getScale(formData.colorScheme);

  for (var i = 0; i < data.length; i++) {
    let item = data[i];
    let seriesName = item[formData.series] as string;
    let entityName = item[formData.entity] as string;
    let year = item[formData.yearColumn] as string;

    let x = item[formData.x.label];
    let y = item[formData.y.label];
    let size = item[formData.size.label];

    var trace = getData(year, seriesName);
    trace.text.push(entityName);

    if (formData.hovertemplate) {
      trace.hovertemplate = formData.hovertemplate;
    }

    trace.id.push(entityName);
    trace.x.push(x);
    trace.y.push(y);
    trace.marker.size.push(size);
    trace.marker.color.push(colorScale(String(x)));
  }

  var years = Object.keys(lookup);
  var firstYear = lookup[years[0]];
  var continents = Object.keys(firstYear);

  var traces = [];
  for (i = 0; i < continents.length; i++) {
    var item = firstYear[continents[i]];
    traces.push({
      name: continents[i],
      x: item.x.slice(),
      y: item.y.slice(),
      id: item.id.slice(),
      text: item.text.slice(),
      mode: "markers",
      marker: {
        size: item.marker.size.slice(),
        sizemode: "area",
        sizeref:
          (2.0 * Math.max(...item.marker.size.slice())) /
          Number(formData.maxBubbleSize || 50) ** 2,
        color: item.marker.color.slice(),
      },
      ...addWhen({
        data: {
          hovertemplate: item.hovertemplate,
        },
        add: Boolean(item.hovertemplate),
        arrayParse: false,
      }),
    });
  }

  let frames = [];
  for (i = 0; i < years.length; i++) {
    frames.push({
      name: years[i],
      data: continents.map(function (continent) {
        return getData(years[i], continent);
      }),
    });
  }

  let sliderSteps = [];

  for (i = 0; i < years.length; i++) {
    sliderSteps.push({
      method: "animate",
      label: years[i],
      args: [
        [years[i]],
        {
          mode: "immediate",
          transition: { duration: 300 },
          frame: { duration: 300, redraw: false },
        },
      ],
    });
  }

  const layout = {
    yaxis: {
      type: "log",
    },
    hovermode: "closest",
    width: Number(width),
    height: Number(height),
    showlegend: formData.showOrientation || false,
    ...addWhen({
      data: {
        legend: {
          orientation: formData.orientation,
          ...addWhen({
            data: {
              y: Number(formData.yorientation),
            },
            add: Boolean(formData.yorientation),
            arrayParse: false,
          }),
          ...addWhen({
            data: {
              x: Number(formData.xorientation),
            },
            add: Boolean(formData.xorientation),
            arrayParse: false,
          }),
          x: formData.x,
        },
      },
      add: Boolean(formData.orientation),
      arrayParse: false,
    }),
    updatemenus: [
      {
        x: -35,
        y: 0,
        yanchor: "top",
        xanchor: "left",
        showactive: true,
        direction: "left",
        type: "buttons",
        pad: { t: 34, r: 10, l: -35 },
        buttons: [
          {
            method: "animate",
            args: [
              null,
              {
                mode: "immediate",
                fromcurrent: true,
                transition: { duration: 300 },
                frame: { duration: 500, redraw: false },
              },
            ],
            label: "Play",
          },
          {
            method: "animate",
            args: [
              [null],
              {
                mode: "immediate",
                transition: { duration: 0 },
                frame: { duration: 0, redraw: false },
              },
            ],
            label: "Stop",
          },
        ],
      },
    ],
    sliders: [
      {
        pad: { l: 60, t: 20 },
        currentvalue: {
          visible: true,
          prefix: capitalize(formData.yearColumn) + ": ",
          xanchor: "right",
          font: { size: 10, color: "#666" },
        },
        steps: sliderSteps as SliderStep[],
      },
    ],
  };

  return {
    data: traces,
    layout: layout,
    config: { showSendToCloud: true },
    frames: frames,
  };
};

export const addWhen = ({
  data,
  add = false,
  arrayParse = true,
}: AddWhenType) => {
  if (!add) {
    return arrayParse ? [] : {};
  }

  return arrayParse && !Array.isArray(data) ? [data] : data;
};

export const capitalize = (word: string) =>
  word ? word.charAt(0).toUpperCase() + word.slice(1) : "";
