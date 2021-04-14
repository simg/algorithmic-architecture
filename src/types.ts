export type Measure = {
  x : number ;
  y : number ;
  z : number ;
}

export type Vector3 = {
  x : number ;
  y : number ;
  z : number ;  
}

export type Vector2 = {
  x : number ;
  y : number ;
}

export type Translation = Measure ;

export type Rotation = {
  axis     : Measure ;
  angle    : number ;
}