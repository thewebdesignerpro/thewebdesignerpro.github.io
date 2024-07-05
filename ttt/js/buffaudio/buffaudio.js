/**
 * BuffAudio.js - http://github.com/eipark/buffaudio
 * A wrapper around the HTML5 Web Audio API to easily play, pause,
 * and skip around an AudioBuffer.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer
 * https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Ernie Park
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var analyser;
var gainNode2;
var buffAudio;
var musb = sourceb = allL = false;
var source;
//var analyser;
var buffer;
var adBuff, adBuff2, adBuff3, adBuff4, adBuff5, adBuff6, adBuff7, adBuff8, adBuff9;
var dropArea;
var audioCtx;
var source;
var xhr;
var started = false;
var mcount = 0;
//var gainNode2;
//var buffAudio;
var pbackT=0;
var trak1B=trak2B=trak3B=trak4B=trak5B=trak6B=trak7B=trak8B=trak9B=false;
 
(function(window, undefined) {
  var BuffAudio = function(audioContext, buffer) {
    this._audioContext = audioContext;
    this._buffer = buffer; // AudioBuffer
    this._source; // AudioBufferSourceNode
    this._playbackTime = 0; // time of the audio playback, seconds
    this._startTimestamp = 0; // timestamp of last playback start, milliseconds
    this._isPlaying = false;
    this._bufferDuration = 0; // seconds

    // Whenever we get a new AudioBuffer, we create a new AudioBufferSourceNode and reset
    // the playback time. Make sure any existing audio is stopped beforehand.
    this.initNewBuffer = function(buffer) {
	  if (this._isPlaying) this.stop();
      this._buffer = buffer;
      this._playbackTime = 0;
    }

    // Create a new AudioBufferSourceNode
    this.initSource = function() {
      this._source = this._audioContext.createBufferSource();
      this._source.buffer = this._buffer;
      //this._source.connect(this._audioContext.destination);
	  
		analyser = this._audioContext.createAnalyser();
		analyser.smoothingTimeConstant = 0.1;
		analyser.fftSize = 512;
		gainNode2 = this._audioContext.createGain();
	
		// Connect audio processing graph
		this._source.connect(analyser);
		analyser.connect(this._audioContext.destination);

		this._source.connect(gainNode2);
		gainNode2.connect(this._audioContext.destination);	  
		
      // Bind the callback to this
      var endOfPlayback = this.endOfPlayback.bind(this);
      this._source.onended = endOfPlayback;		
    }


    // Play the currently loaded buffer
    this.play = function() {
      //console.log("Play");
      if (this._isPlaying) return;
      var when = 0; // when to schedule playback, 0 is immediately
      this.initSource();
	  this._playbackTime = pbackT;
      this._source.start(0, this._playbackTime);
      this._startTimestamp = Date.now();
      this._isPlaying = true;
    }

    // Seek to a specific playbackTime (seconds) in the audio buffer. Do not change
    // playback state.
    this.seek = function(playbackTime) {
      if (playbackTime === undefined) return;
      if (playbackTime > this._buffer.duration) {
        console.log("[ERROR] Seek time is greater than duration of audio buffer.");
        return;
      }

      if (this._isPlaying) {
        this.stop(); // Stop any existing playback if there is any
		//console.log(playbackTime);
        this._playbackTime = playbackTime;
        this.play(); // Resume playback at new time
      } else {
		//console.log('seek paused');
        this._playbackTime = playbackTime;
      }
    }

    // Pause playback, keep track of where playback stopped
    this.pause = function() {
		//console.log('this paused');
      this.stop(true);
    }

    // Stops or pauses playback and sets playbackTime accordingly
    this.stop = function(pause) {
      //if (!this._isPlaying) return;
      //console.log("Stop");	  
      this._isPlaying = false; // Set to flag to endOfPlayback callback that this was set manually
      this._source.stop(0);
      // If paused, calculate time where we stopped. Otherwise go back to beginning of playback (0).
	  //console.log(this._playbackTime);	  
      this._playbackTime = pause ? (Date.now() - this._startTimestamp)/1000 + this._playbackTime : 0;
	  //console.log(this._playbackTime);	  
    }

    // Callback for any time playback stops/pauses
    this.endOfPlayback = function(endEvent) {
      //console.log("end of playback");

      // If playback stopped because end of buffer was reached
      if (this._isPlaying) this._playbackTime = 0;
      this._isPlaying = false;
    }

    this.init = (function() {
      this.initNewBuffer(this._buffer);
    });

		//if (mcount==1) {
		//console.log('initSource');
		this.initSource();
	//}	
	
  };

  // Set BuffAudio on the global window object
  window.BuffAudio = BuffAudio;

})(window);
