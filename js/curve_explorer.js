$.getJSON('../assets/traintest_curves_rr.json', function(data_json) {

    //data is the JSON string
    var n_timesteps = 5;
    var feat_colors =    [
        '#1f77b4',  // muted blue
        '#ff7f0e',  // safety orange
        '#2ca02c',  // cooked asparagus green
        '#d62728',  // brick red
        '#9467bd',  // muted purple
        '#8c564b',  // chestnut brown
        '#e377c2',  // raspberry yogurt pink
        '#7f7f7f',  // middle gray
        '#bcbd22',  // curry yellow-green
        '#17becf'   // blue-teal
    ];

    // Structure of data:
    // tasks:
    //   feature:
    //     subset \in ['train', 'test']:
    //       x: timesteps
    //       y: rewards
    // var traces = {};
    var subsets = ['train', 'test'];
    // var feats = ['Depth', 'Autoencoder', 'Scratch'];
    // var tasks = ['Explore', 'Navigate', 'Planning'];
    // tasks.forEach(function(task) {
    // traces[task] = {}
    // for (let [index, feat] of feats.entries()) {
    //     traces[task][feat] = {}
    //     for (subset in subsets) {
    //     traces[task][feat][subsets[subset]] = {'x': [], 'y': []}
    //     for (i = 0; i < n_timesteps; i++) {
    //         traces[task][feat][subsets[subset]]['x'].push(i);
    //         traces[task][feat][subsets[subset]]['y'].push(index * i + (subsets[subset] == 'train' ? 1 : 0));
    //     }
    //     }
    // }
    // });
    var traces = data_json;

    // Assign colors
    var feats_to_colors = {}
    for (let [index, feat] of Object.keys(traces['explore']).entries()) {
        feats_to_colors[feat] = feat_colors[index % feat_colors.length] ;
    }
    feats_to_colors['Scratch'] = '#444444'
    feats_to_colors['Pixels-as-state'] = '#666666'
    // feats_to_colors['Blind']

    // Populate 'data' with the traces from data_json
    var data = []
    for (let [plot_num, task] of Object.keys(traces).entries()) {
        for (feat in traces[task]) {
            for (subset_idx in subsets) {
                subset = subsets[subset_idx];
                var is_training = (subset == 'train');
                trace = {
                    name: feat, // + " " + subsets[subset],
                    x: traces[task][feat][subset]['x'],
                    y: traces[task][feat][subset]['y'],
                    xaxis: 'x' + (plot_num + 1),
                    yaxis: 'y' + (plot_num + 1),
                    type: 'scatter',
                    line: {
                        dash: is_training ? 'dashdot' : 'solid'
                    },
                    legendgroup: feat,
                    showlegend: (plot_num == 0 && !is_training) ? true: false,
                    marker: {
                        color: feats_to_colors[feat] + (is_training ? "88" : "")
                    },
                    visible: (feat == 'Scratch' || feat == 'Autoencoder') ? true :  'legendonly'
                }
                data.push(trace)
            }
        }
    }

    // Add "blind" lines
    var max_timesteps_per_task = {}
    for (let [plot_num, task] of Object.keys(traces).entries()) {
        max_timesteps_per_task[task] = 0.0;
        for (feat in traces[task]) {
            for (subset_idx in subsets) {
                subset = subsets[subset_idx];
                var curr = Math.max(...traces[task][feat][subset]['x']);
                max_timesteps_per_task[task] = Math.max(max_timesteps_per_task[task], curr);
            }
        }
    }

    var line_shapes = []
    for (let [plot_num, task] of Object.keys(traces).entries()) {
        console.log(Math.max(...traces[task]['Blind']['test']['x']))
        shape = {
            type: 'line',
            x0: 0,
            y0: 1,
            x1: max_timesteps_per_task[task],
            y1: 1,
            xref:'x' + (plot_num + 1), yref:'y' + (plot_num + 1),
            line: {
                // color: 'rgb(50, 171, 96)',
                color: '#888',
                width: 1,
                dash: 'solid'
            }
        }
        line_shapes.push(shape)
    }
    // var trace1 = {
    //   x: [1, 2, 3],
    //   y: [4, 5, 6],
    //   type: 'scatter',
    //   legendgroup: 'a',
    // };

    // var trace2 = {
    //   x: [20, 30, 40],
    //   y: [50, 60, 70],
    //   xaxis: 'x2',
    //   yaxis: 'y2',
    //   type: 'scatter'
    // };

    // var trace3 = {
    //   x: [300, 400, 500],
    //   y: [600, 700, 800],
    //   xaxis: 'x3',
    //   yaxis: 'y3',
    //   type: 'scatter'
    // };

    // var trace4 = {
    //   x: [4000, 5000, 6000],
    //   y: [7000, 8000, 9000],
    //   xaxis: 'x3',
    //   yaxis: 'y3',
    //   type: 'scatter'
    // };

    // var data = [trace1, trace2, trace3, trace4];

    var layout = {
        grid: {rows: 1, columns: 3,
            pattern: 'independent',
        },
        legend: {
            tracegroupgap: 0,
                // x: 1.1,
                // y: -0.20,
            font: {
                size: 11,
            }
        },
        yaxis1: {
            title: 'Relative Reward vs. Blind',
            titlefont: {
                // family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f'
            },
            anchor: 'y1',
            hoverformat: '.1f'

        },
        xaxis1: {
            title: '# Frames',
            titlefont: {
                color: '#7f7f7f'
            },
            anchor: 'x1'
        },
        yaxis2: {
            hoverformat: '.1f',
            anchor: 'y2'
        },
        xaxis2: {
            title: '# Frames',
            titlefont: {
                color: '#7f7f7f'
            },
            anchor: 'x2'
        },
        yaxis3: {
            // title: 'Average Reward',
            // titlefont: {
            //     // family: 'Courier New, monospace',
            //     size: 18,
            //     color: '#7f7f7f'
            // },
            anchor: 'y3',
            hoverformat: '.1f'
        },
        xaxis3: {
            title: '# Frames',
            titlefont: {
                color: '#7f7f7f'
            },
            anchor: 'x3'
        },
        shapes: line_shapes,
        height: 630,
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        annotations: [
            {
                text: "Exploration",
                font: {
                    size: 16,
                    color: '#565656',
                },
                showarrow: false,
                align: 'center',
                x: 0.17, //position in x domain
                y: 1.05, //position in y domain
                xanchor: 'center',
                // yanchor: 'center',
                xref: 'paper',
                yref: 'paper',
            },
            {
                text: "Navigation",
                font: {
                    size: 16,
                    color: '#565656',
                },
                showarrow: false,
                align: 'center',
                x: 0.53, //position in x domain
                y: 1.05,  // position in y domain
                xanchor: 'center',
                xref: 'paper',
                yref: 'paper',
            },
            {
                text: "Local Planning",
                font: {
                    size: 16,
                    color: '#565656',
                },
                showarrow: false,
                align: 'center',
                x: 0.86, //position in x domain
                // y: 0.45,  // position in y domain
                y: 1.05,  // position in y domain
                xanchor: 'center',
                xref: 'paper',
                yref: 'paper',
            }
          ]
    };

    Plotly.newPlot('chartDiv', data, layout, {responsive: true});

});