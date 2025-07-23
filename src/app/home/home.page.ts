import { Component } from '@angular/core';
import { Platform, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var cordova: any;

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage {

  isAuthorized = false;
  error: string | null = null;

  distance = 0;
  distancePerDay: { date: string, value: number }[] = [];
  distanceRawJson: string = '';

  steps = 0;
  stepsPerDay: { date: string, value: number }[] = [];
  stepsRawJson: string = '';

  heartRate = 0;
  heartRatePerDay: { date: string, value: number }[] = [];
  heartRateRawJson: string = '';

  calories = 0;
  caloriesPerDay: { date: string, value: number }[] = [];
  caloriesRawJson: string = '';

  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      this.requestHealthAccess();
    });
  }

  async requestHealthAccess() {
    try {
      const available = await new Promise<boolean>((resolve, reject) =>
        cordova.plugins.health.isAvailable(resolve, reject)
      );

      if (!available) {
        const msg = 'Google Fit / Apple Health / Health Connect not available.';
        this.error = msg;
        alert(msg);
        return;
      }

      const alreadyAuthorized = await new Promise<boolean>((resolve, reject) =>
        cordova.plugins.health.isAuthorized({
          read: ['steps', 'distance', 'heart_rate', 'calories'],
          write: []
        }, resolve, reject)
      );

      if (alreadyAuthorized) {
        this.isAuthorized = true;
        alert("Already authorized. Loading step,distance,heartrate, nutrition and calories data...");
        await this.safeLoadData();
        return;
      }

      const granted = await new Promise<boolean>((resolve, reject) =>
        cordova.plugins.health.requestAuthorization({
          read: ['steps', 'distance', 'heart_rate', 'calories'],
          write: []
        }, resolve, reject)
      );

      if (granted) {
        this.isAuthorized = true;
        alert("Permission granted. Loading step,distance,heartrate, and calories data...");
        await this.safeLoadData();
      } else {
        const msg = "Authorization denied by user.";
        this.error = msg;
        alert(msg);
      }

    } catch (err: any) {
      const errMsg = "Error during health access: " + err;
      this.error = errMsg;
      alert(errMsg);

      if (typeof cordova.plugins.health.getHealthConnectFromStore === 'function') {
        cordova.plugins.health.getHealthConnectFromStore(
          () => alert("Opened Health Connect in Play Store."),
          (err: any) => alert("Failed to open Play Store: " + err)
        );
      }
    }
  }



  private async safeLoadData() {
    try {
      await this.loadSteps();
    } catch (err) {
      console.error("Step loading failed:", err);
      alert("Failed to load step data.");
    }

    try {
      await this.loadDistance();
    } catch (err) {
      console.error("Distance loading failed:", err);
      alert("Failed to load distance data.");
    }

    try {
      await this.loadHeartRate();
    } catch (err) {
      console.error("Heart rate loading failed:", err);
      alert("Failed to load heart rate data.");
    }

    try {
      await this.loadCalories();
    } catch (err) {
      console.error("Calories loading failed:", err);
      alert("Failed to load calories data.");
    }
}

    async loadSteps() {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7); // Last 7 days

    this.steps = 0;
    this.stepsPerDay = [];
    this.stepsRawJson = '';

    try {
      const stepsAggregated = await new Promise<any[]>((resolve, reject) =>
        cordova.plugins.health.queryAggregated({
          startDate: start,
          endDate: end,
          dataType: 'steps',
          bucket: 'day'
        }, resolve, reject)
      );

      this.stepsRawJson = JSON.stringify(stepsAggregated, null, 2);

      this.stepsPerDay = stepsAggregated.map(entry => ({
        date: new Date(entry.startDate).toLocaleDateString(),
        value: Number(entry.value)
      }));

      this.steps = this.stepsPerDay.reduce((sum, d) => sum + d.value, 0);

      // alert("Steps data loaded successfully.");
    } catch (err: any) {
      alert("Failed to load steps data: " + err);
    }
  }





  async loadDistance() {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7); // Last 7 days

    this.distance = 0;
    this.distancePerDay = [];
    this.distanceRawJson = '';

    try {
      const distanceAggregated = await new Promise<any[]>((resolve, reject) =>
        cordova.plugins.health.queryAggregated({
          startDate: start,
          endDate: end,
          dataType: 'distance',
          bucket: 'day'
        }, resolve, reject)
      );

      this.distanceRawJson = JSON.stringify(distanceAggregated, null, 2);

      this.distancePerDay = distanceAggregated.map(entry => ({
        date: new Date(entry.startDate).toLocaleDateString(),
        value: Number(entry.value)
      }));

      this.distance = this.distancePerDay.reduce((sum, d) => sum + d.value, 0);

      // alert("Distance data loaded successfully.");
    } catch (err: any) {
      alert("Failed to load distance data: " + err);
    }
  }








  async loadHeartRate() {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7); // Last 7 days

    this.heartRate = 0;
    this.heartRatePerDay = [];
    this.heartRateRawJson = '';

    try {
      const heartRateAggregated = await new Promise<any[]>((resolve, reject) =>
        cordova.plugins.health.queryAggregated({
          startDate: start,
          endDate: end,
          dataType: 'heart_rate',
          bucket: 'day'
        }, resolve, reject)
      );

      this.heartRateRawJson = JSON.stringify(heartRateAggregated, null, 2);

      this.heartRatePerDay = heartRateAggregated.map(entry => ({
        date: new Date(entry.startDate).toLocaleDateString(),
        value: Number(entry.value)
      }));

      this.heartRate = this.heartRatePerDay.reduce((sum, d) => sum + d.value, 0);

      // alert("Heart rate data loaded successfully.");
    } catch (err: any) {
      alert("Failed to load heart rate data: " + err);
    }
  }









  async loadCalories() {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7); // Last 7 days

    this.calories = 0;
    this.caloriesPerDay = [];
    this.caloriesRawJson = '';

    try {
      const caloriesAggregated = await new Promise<any[]>((resolve, reject) =>
        cordova.plugins.health.queryAggregated({
          startDate: start,
          endDate: end,
          dataType: 'calories',
          bucket: 'day'
        }, resolve, reject)
      );

      this.caloriesRawJson = JSON.stringify(caloriesAggregated, null, 2);

      this.caloriesPerDay = caloriesAggregated.map(entry => ({
        date: new Date(entry.startDate).toLocaleDateString(),
        value: Number(entry.value)
      }));

      this.calories = this.caloriesPerDay.reduce((sum, d) => sum + d.value, 0);

      // alert("Calories data loaded successfully.");
    } catch (err: any) {
      alert("Failed to load calories data: " + err);
    }
  }








}