import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { ParametersService } from '../parameters.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  deviceInfo: DeviceInfo;
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;;

  appName = ParametersService.AppName;
  
  constructor(private deviceService: DeviceDetectorService) {}

  ngOnInit() {
    this.detectDevice();
  }

  public detectDevice(){
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile=this.deviceService.isMobile();
    this.isDesktop=this.deviceService.isDesktop();
    this.isTablet=this.deviceService.isTablet();
  }
}
