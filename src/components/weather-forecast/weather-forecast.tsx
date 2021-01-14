import {Component, Host, h, State, Prop} from '@stencil/core';

@Component({
  tag: 'weather-forecast',
  styleUrl: 'weather-forecast.css',
  shadow: true,
})
export class WeatherForecast {
  @State() response: Array<any>;
  @State() forecasts: Array<any>;
  @State() chosenItem: Object;
  @State() days: Number;
  @State() dayClass: string;

  @Prop() lat: string;
  @Prop() lon: string;
  @Prop() apikey: string;
  @Prop() iconBase: string = "https://web-components-bachelor.netlify.app/Components/Wetter/";
  @Prop() units: string = "metric";
  @Prop() lang: string = "en";
  @Prop() exclude: string = "";

  render() {
    this.forecasts= [];
    if(this.response!=undefined){
      for(let i =0; i < this.days; i++){
        this.forecasts.push(<daily-forecast key={this.response[i].dt}
                                            class={this.response[i] == this.chosenItem? "chosen": ""}
                                            data={this.response[i]}
                                            iconBase = {this.iconBase}
                                            exclude = {this.exclude}
                                            onClick={() => {
                                              this.chosenItem = this.response[i];
                                            }}/>);
      }
      if(this.response.indexOf(this.chosenItem)<0 || this.response.indexOf(this.chosenItem)>=this.days){
        this.chosenItem = this.response[0];
      }
      console.log("forecasts updated");
      console.log(this.forecasts);
    }
    return (
      <Host>
        <div class="btn-group">
          <button onClick={(e)=>this.updateDays(e)} class={this.days==1?"active" : " "} id="current">Heute</button>
          <button onClick={(e)=>this.updateDays(e)} class={this.days==3?"active" : " "} id="three">3-Tage</button>
          <button onClick={(e)=>this.updateDays(e)} class={this.days==5?"active" : " "} id="five">5-Tage</button>
          <button onClick={(e)=>this.updateDays(e)} class={this.days==8?"active" : " "} id="eight">8-Tage</button>
        </div>
        <div id="weather" class={this.dayClass}>
          {this.forecasts}
          {this.chosenItem != undefined?
            <daily-forecast
              class="show"
              id="show"
              data={this.chosenItem}
              iconBase={this.iconBase}
              exclude={this.exclude}/>:" "}
          <slot></slot>
        </div>
      </Host>
    );
  }
  connectedCallback(){
    let url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + this.lat + "&lon=" + this.lon + "&exclude=hourly,minutely&appid=" + this.apikey + "&units=" + this.units +"&lang=" + this.lang;
    fetch(url)
      .then(response => response.json()).then(res => {this.response = res.daily; console.log("OG DATA");console.log(res)})
      .catch(err => {
        console.error(err);
      });
    this.days = 1;
    this.dayClass="current";
  }
  updateDays(e){
    switch(e.target.getAttribute('id')){
      case "current": this.days = 1; break;
      case "three": this.days = 3; break;
      case "five": this.days = 5; break;
      case "eight": this.days = 8; break;
    }
    this.dayClass = e.target.getAttribute("id");
  }
}
