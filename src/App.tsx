import React, {Component} from 'react';
import './App.css';
import Sequencer from './components/shared/Sequencer/Sequencer';
import SoundFontPlayer from "soundfont-player";

export default class App extends Component{
    state = {
        bpm: 120,
        tones: ['C','C#','D', 'D#','E','F','F#','G','G#','A','A#', 'B'],
        piano: null,
        ac: new AudioContext()
    };

    render() {
        return (
            <div className="App">
                <Sequencer bpm={120} play={(cells) => { this.playHandler(cells)} }/>
            </div>
        );
    }

    componentDidMount() {
        SoundFontPlayer.instrument(this.state.ac, 'acoustic_grand_piano').then(piano => {
            this.setState({piano});
        })
    }

    getNoteDurationForBpm(division, bpm) {
        return bpm / 60 / division;
    }

    playHandler(cells) {
        console.log(cells);
        const notes = cells.map(cell => {
            return {
                pitch: this.state.tones[this.state.tones.length - 1 - cell.row % this.state.tones.length],
                octave: cell.octave,
                duration: this.getNoteDurationForBpm(cell.resolution, this.state.bpm),
                offset: this.getNoteDurationForBpm(cell.resolution, this.state.bpm) * cell.col,
            }
        });
        notes.forEach(note => {
            console.log(note);
            this.state.piano.play(note.pitch + note.octave, this.state.ac.currentTime + note.offset, { duration: note.duration});
        });
    }
}
