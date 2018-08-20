export default class AudioRecorderPlayer {
  private _isRecording: boolean;
  private _isPlaying: boolean;
  private _subscription: any;
  private _recordInterval: any;

  /**
   * Convert seconds into minute:second string format.
   * @param {string} seconds
   * @returns {string} 00:00
   */
  public mmss(secs: number) : string;

  /**
   * Convert seconds into minute:second:millis string format.
   * @param {string} miliseconds
   * @returns {string} 00:00:00
   */
  public mmssss(milisecs: number) : string;

  /**
   * Set record interval.
   * @returns {string}
   */
  public setRecordInterval(milisecs: number) : Promise<void>;

  /**
   * Remove record interval.
   * @returns {void}
   */
  public removeRecordInterval(callBack) : void;

  /**
   * Add playback listener.
   * @param {Event} playback current_position, duration
   * @returns {void}
   */
  public addRecordBackListener(fn: Function) : void;

  /**
   * Remove playback listener.
   * @returns {void}
   */
  public removeRecordBackListener() : void;

  /**
   * Add playback listener.
   * @param {Event} playback current_position, duration
   * @returns {void}
   */
  public addPlayBackListener(fn: Function) : void;

  /**
   * Remove playback listener.
   * @returns {void}
   */
  public removePlayBackListener() : void;

  /**
   * Set callback duration. Default is 0.01 which will be heavy apps doing many things concurrently.
   */
  public setSubscriptionDuration() : Promise<string>;

  /**
   * Start recording.
   * @param {uri} audioPathUri no param will save audio in default location
   * @returns {Promise<string>} audioFileURI
   */
  public startRecorder(uri?: string) : Promise<string>;

  /**
   * Stop recording.
   * @returns {Promise<string>}
   */
  public stopRecorder() : Promise<string>;

  /**
   * Start playing.
   * @param {uri} audioPathUri no param will save audio in default location
   * @returns {Promise<string>} audioFileURI
   */
  public startPlayer(uri?: string) : Promise<string>;

  /**
   * Stop playing.
   * @returns {Promise<string>}
   */
  public stopPlayer() : Promise<string>;

  /**
   * Pause playing.
   * @returns {Promise<string>}
   */
  public pausePlayer() : Promise<string>;

  /**
   * Seek to.
   * @param {string} time position seek to in second.
   * @returns {Promise<string>}
   */
  public seekToPlayer(time: number) : Promise<string>;

  /**
   * setSubscriptionDuration.
   * @param {number} sec subscription callback duration in seconds.
   * @returns {Promise<string>}
   */
  public setSubscriptionDuration(time: number) : Promise<string>;
}
