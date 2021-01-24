import { trigger, state,stagger, style, transition, animate, query, group } from "@angular/animations";

/**
 * This animation will force the div to grow from its top right corner smoothly
 * 
 * height: 0 is important.
 */
export const bannerAnimation = 
  trigger('bannerAnimation', [
    transition(":increment", group([
      query(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('.7s linear', style('*'))
      ], { optional: true }),
      query(':leave', [
        animate('.7s linear', style({ transform: 'translateY(100%)', opacity: 0, height: 0 }))
      ], { optional: true })
    ])),
    transition(":decrement", group([
      query(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 1 }),
        animate('0.7s linear', style('*'))
      ], { optional: true }),
      query(':leave', [
        animate('0.7s linear', style({ transform: 'translateY(100%)', opacity: 0, height: 0 }))
      ], { optional: true })
    ])),
  ])
