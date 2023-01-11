/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import {
  CategoricalColorNamespace,
  ChartProps,
  PlainObject,
  TimeseriesDataRecord,
} from "@superset-ui/core";
import { IndiaGeoJson } from "../data/india_geojson";
import { addWhen } from "../utils";

export const getLabelData = ({ label, data }: { label: string; data: any }) =>
  data.map((item: PlainObject) => item?.[label] || "");

export const getGeoData = ({ label, data }: { label: string; data: any }) =>
  IndiaGeoJson.features.map(
    (item: PlainObject) => item.properties?.[label] || ""
  );

export default function transformProps(chartProps: ChartProps) {
  const { width, height, formData, queriesData } = chartProps;
  const { boldText, headerFontSize, headerText } = formData;
  const data = queriesData[0].data as TimeseriesDataRecord[];
  const colorScale = CategoricalColorNamespace.getScale(formData.colorScheme);
  const scatters = getLabelData({ data, label: formData.metrics[1]?.label });

  return {
    width,
    height,
    layout: {
      height,
      width,
      margin: { l: 0, t: 0, b: 0, r: 0 },
      mapbox: {
        center: { lat: 21.8913, lon: 78.0792 },
        zoom: formData.zoom,
        style: formData.mapStyle,
        bearing: 0,
        layers: [
          {
            sourcetype: "geojson",
            source: IndiaGeoJson as any,
            below: "",
            type: "line",
            line: {
              width: Number(formData.lineWidth),
            },
            color: formData.lineColor,
          },
          {
            sourcetype: "geojson",
            source: IndiaGeoJson as any,
            below: "water",
            type: "fill",
            color: "whitesmoke",
            opacity: 0.8,
          },
        ],
      },
    },
    data: [
      {
        hovertemplate: formData.hoverTemplate,
        locations: getLabelData({ data, label: formData.entity }),
        z: getLabelData({ data, label: formData.metrics[0].label }),
        geojson: IndiaGeoJson,
        featureidkey: "properties.id",
        colorbar: {
          title: formData.metrics[0].label,
          len: 0.35,
          bgcolor: "rgba(255,255,255,0.6)",
          xanchor: "right",
          x: 0.0,
          yanchor: "bottom",
          y: 0.0,
        },
        colorscale: [
          [0.0, colorScale(0.0)],
          [0.25, colorScale(0.25)],
          [0.5, colorScale(0.5)],
          [0.75, colorScale(0.75)],
          [1.0, colorScale(1.0)],
        ],
        type: "choroplethmapbox",
      },
      ...addWhen({
        data: {
          hovertemplate: formData.bubbleHoverTemplate,
          type: "scattermapbox",
          text: getGeoData({ data, label: "ST_NM" }),
          lon: getGeoData({ data, label: "INSIDE_X" }),
          lat: getGeoData({ data, label: "INSIDE_Y" }),
          marker: {
            color: formData.bubbleColorScheme,
            size: scatters,
            sizemode: "area",
            sizeref:
              (2.0 * Math.max(...scatters)) /
              Number(formData.maxBubbleSize || 35) ** 2,
            opacity: 0.7,
          },
          showlegend: true,
        },
        add: Boolean(scatters?.length),
      }),
    ],
    boldText,
    headerFontSize,
    headerText,
    formData,
  };
}
