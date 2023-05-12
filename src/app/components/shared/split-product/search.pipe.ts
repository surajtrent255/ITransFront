import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
args!:string;
  transform(value: any, args?: string[]): string {
    if(!value) return "null" ;
    if(!args) return value;
   return value.filter((item:string)=>{
    return JSON.stringify(item).includes(this.args);
   })

  }

}
