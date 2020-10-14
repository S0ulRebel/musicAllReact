import React, {Component} from "react";
import CSS from 'csstype';

const wrapperStyles: CSS.Properties = {
    display: "flex",
    flexDirection: "column",
    height: '100%',
    width: '100%'
};

const emptyCellStyles: CSS.Properties = {
    fill: 'white',
    strokeWidth: '1px',
    stroke: '#999',
    left: '20px'
};

const cellStyles: CSS.Properties = {
    fill: 'red',
    strokeWidth: '1px',
    stroke: '#666',
    left: '20px'
};

type cell = {
    row:number,
    col:number,
    resolution:number,
    octave:number
}

const numTonesInOctave = 12;
const resolutionOptions = [1, 2, 4, 8, 12, 16, 32];

export default class Sequencer extends Component {
    state = {
        bpm: 120,
        resolution: 8,
        measures: 1,
        octaves: 2,
        startOctave: 3,
        cells: [],
    };

    getNumRows = () => this.state.octaves * numTonesInOctave;
    getNumCols = () => this.state.resolution * this.state.measures;
    getCellWidth = (resolution:number) => 100 / (resolution * this.state.measures);
    getCellHeight = () => 100 / (this.state.octaves * numTonesInOctave);
    getCellXOffset = (cell:cell) => {
      return this.getCellWidth(cell.resolution) * cell.col;
    };
    getOctaveNum = (row) => (this.state.startOctave + this.state.octaves) - Math.floor(row / numTonesInOctave);

    render() {
        return (
            <div className="sequencer" style={wrapperStyles}>

                <div className="controls">
                    <button onClick={() => this.clearAllCells()}>Clear</button>
                    <label>Grid:</label>
                    <select
                        defaultValue={this.state.resolution}
                        onInput={e => this.setResolution(e)}>
                        {resolutionOptions.map(opt =>
                            <option
                                key={opt}
                                value={opt}>{opt}</option>
                        )}
                    </select>

                    <label>Measures:</label>
                    <input
                        defaultValue={this.state.measures}
                        type="number"
                        onInput={e => this.setMeasuresNum(e)}/>

                    <label>Octaves:</label>
                    <input
                        defaultValue={this.state.octaves}
                        type="number"
                        onInput={e => this.setOctavesNum(e)}/>

                    <button onClick={() => this.playHandler()}>Play</button>
                </div>

                <svg height="100%" width="100%">

                    {[...Array(this.getNumRows())].map((e, row) => {
                        return [...Array(this.getNumCols())].map((e, col) =>
                            <rect
                                key={'row' + row + '-col' + col}
                                x={col * this.getCellWidth(this.state.resolution) + '%'}
                                y={row * this.getCellHeight() + '%'}
                                height={this.getCellHeight() + '%'}
                                width={this.getCellWidth(this.state.resolution) + '%'}
                                style={emptyCellStyles}
                                onClick={() => this.addCell(row,col, this.state.resolution)}/>
                        );
                    })}

                    {this.state.cells.map(cell =>
                        <rect
                            key={'filled-row' + cell.row + '-col' + cell.col}
                            x={this.getCellXOffset(cell) + '%'}
                            y={cell.row * this.getCellHeight() + '%'}
                            height={this.getCellHeight() + '%'}
                            width={this.getCellWidth(cell.resolution) + '%'}
                            style={cellStyles}
                            onClick={() => this.removeCell(cell)}/>
                    )}
                </svg>
            </div>
        )
    }

    setResolution(e:Event) {
        this.setState({resolution: e.target.value})
    }

    setMeasuresNum(e:Event) {
        this.setState({measures: e.target.value})
    }

    setOctavesNum(e:Event) {
        this.setState({octaves: e.target.value})
    }

    addCell(row:number, col:number, resolution:number) {
        const cell:cell = {
            row,
            col,
            resolution,
            octave: this.getOctaveNum(row),
        };
        let cells = [...this.state.cells];
        cells = cells.filter((c:cell) => {
            const offsetA = this.getCellXOffset(c);
            const offsetB = this.getCellXOffset(cell);
            const widthA =  this.getCellWidth(c.resolution);
            const widthB =  this.getCellWidth(cell.resolution);
            if(c.row === cell.row && offsetA >= offsetB && offsetA < offsetB + widthB) return false;
            return true;
        });
        cells.push(cell);
        console.log(cells);
        this.setState({cells: [...cells]});
    }

    removeCell(cell:cell) {
        let cells = [...this.state.cells];
        const index = cells.findIndex(e => e.row === cell.row && e.col === cell.col && e.resolution === cell.resolution);
        cells.splice(index, 1);
        this.setState({cells: [...cells]});
    }

    clearAllCells() {
        this.setState({cells: []});
    }

    playHandler() {
        this.props.play(this.state.cells);
    }
}
