import {Component, Host, h, Prop} from '@stencil/core';

function getWeekdayName(number){
  let weekdays = ["SO", "MO", "DI", "MI", "DO", "FR", "SA"];
  return weekdays[number];
}

@Component({
  tag: 'daily-forecast',
  styleUrl: 'daily-forecast.css',
  shadow: true,
})
export class DailyForecast {
 @Prop() data;
 @Prop() iconBase: string;
 @Prop() exclude: string;
 @Prop() id:string;
  render(){
    let sunrise = new Date(parseInt(this.data.sunrise)*1000);
    let sunset = new Date(parseInt(this.data.sunset)*1000);
    let date =new Date(parseInt(this.data.dt)*1000);
    let tempIcon ="temperature-warm.svg";
    if(parseFloat(this.data.temp.max) >= 25){
      tempIcon = "temperature-hot.svg";
    }
    if(parseFloat(this.data.temp.min) <= 10){
      tempIcon = "temperature-cold.svg";
    }
    return <Host id={this.id} class={this.id}>
      <div class="weather-day">
        <div class="base">
          <img alt={this.data.weather[0].description} id="icon" src={this.iconBase+this.data.weather[0].icon + ".png"}/>
          <p id="date">{getWeekdayName(date.getDay())}</p>
        </div>
        <div class="extra">
          <p>
            <img alt={this.data.weather[0].description} class="icon" src={this.iconBase+this.data.weather[0].icon + ".png"}/>
            {this.data.weather[0].description}
          </p>
          {!this.exclude.includes("temperature")?
            <p><img alt="Temperature Icon" class="icon" src={this.iconBase + tempIcon}/>
              {this.data.temp.min + "° / " + this.data.temp.max + "°"}
            </p>
            :""}
          {!this.exclude.includes("rain")?
            <p><img alt="Rain Icon" class="icon" src={this.iconBase + "rain.svg"}/>
              {parseInt(String(parseFloat(this.data.pop)*100)) + "%" +
              (this.data.rain?", " + this.data.rain+"mm":"")
              +(this.data.snow?", Schnee: " + this.data.snow+"mm":"")}
            </p>
            :""}
          {!this.exclude.includes("wind")?
            <p><img alt="Wind Icon" class="icon" src={this.iconBase + "wind.svg"}/>
              {this.data.wind_speed + "m/s"}
            </p>
            :""}
          {!this.exclude.includes("sun")?
            <div>
              <p><img alt="Sunrise Icon" class="icon" src={this.iconBase + "sunrise.svg"}/>
                {sunrise.getHours() + ":" + (sunrise.getMinutes() <10? "0":"") + sunrise.getMinutes()}
              </p>
              <p><img alt="Sunset Icon" class="icon" src={this.iconBase + "sunset.svg"}/>
                {sunset.getHours() + ":" + (sunset.getMinutes() <10? "0":"")+ sunset.getMinutes()}
              </p>
            </div>
            :""}
        </div>
      </div>
    </Host>
  }
}
