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
import React, { createRef } from 'react';
import Plot from "react-plotly.js";
import { styled } from '@superset-ui/core';
import { SupersetPluginPlotlyMapProps, SupersetPluginPlotlyMapStylesProps } from './types';

// The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled

// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

const Styles = styled.div<SupersetPluginPlotlyMapStylesProps>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;

  h3 {
    /* You can use your props to control CSS! */
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.gridUnit * 3}px;
    font-size: ${({ theme, headerFontSize }) => theme.typography.sizes[headerFontSize]}px;
    font-weight: ${({ theme, boldText }) => theme.typography.weights[boldText ? 'bold' : 'normal']};
  }

  pre {
    height: ${({ theme, headerFontSize, height }) => (
    height - theme.gridUnit * 12 - theme.typography.sizes[headerFontSize]
  )}px;
  }
`;


export default function SupersetPluginPlotlyMap(props: SupersetPluginPlotlyMapProps) {
  const { data, height, width, layout } = props;
  const rootElem = createRef<HTMLDivElement>();

  return (
    <Styles
      ref={rootElem}
      boldText={props.boldText}
      headerFontSize={props.headerFontSize}
      height={height}
      width={width}
    >
      <Plot
        data={data}
        layout={layout}
        config={{
          displayModeBar: false,
          mapboxAccessToken: "pk.eyJ1IjoidmlrcmFtb3RzaSIsImEiOiJjbGJwYWp2OW8wZmJ6M25tcmdnanNxODB1In0.l04RVGw0Ta47VqEUo53qYA"
        }}
      />
    </Styles>
  );
}
