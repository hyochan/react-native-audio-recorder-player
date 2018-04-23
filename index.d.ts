export class AudioRecorderPlayer {
  private _isRecording: boolean;
  private _isPlaying: boolean;
  private _subscription: any;
  private _recordInterval: any;

  /**
   * Convert seconds into minute:second string format.
   * @returns {string}
   */
  public mmss(secs: number) : string;

  /**
   * Set record interval.
   * @returns {string}
   */
  public setRecordInterval() : Promise<void>;

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
  public addPlayBackListener(e: Event) : void;

  /**
   * Remove playback listener.
   * @returns {void}
   */
  public removePlayBackListener() : void;

  /**
   * Start recording.
   * @param {uri} audioPathUri no param will save audio in default location
   * @returns {Promise<string>}
   */
  public startRecord(uri?: string) : Promise<string>;

  /**
   * Stop recording.
   * @returns {Promise<string>}
   */
  public stopRecord() : Promise<string>;

  /**
   * Start playing.
   * @param {uri} audioPathUri no param will save audio in default location
   * @returns {Promise<string>}
   */
  public startPlay(uri?: string) : Promise<string>;

  /**
   * Stop playing.
   * @returns {Promise<string>}
   */
  public stopPlay() : Promise<string>;

  /**
   * Pause playing.
   * @returns {Promise<string>}
   */
  public pausePlay() : Promise<string>;

  /**
   * Seek to.
   * @returns {Promise<string>}
   */
  public seekTo(time: number) : Promise<string>;
}