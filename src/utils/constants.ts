import { Texture } from 'pixi.js'
import pollito_blanco from './../assets/pollito_blanco.png'
import pollito_cafe from './../assets/pollito_cafe.png'
import pelota from './../assets/pelota.png'

// How fast the red square moves
export const MOVEMENT_SPEED = 0.05;

// Strength of the impulse push between two objects
export const IMPULSE_POWER = 10;

// Texturas
export const POLLITO_BLANCO_TEXTURA = Texture.from(pollito_blanco)
export const POLLITO_CAFE_TEXTURA = Texture.from(pollito_cafe)
export const PELOTA_TEXTURA = Texture.from(pelota)
