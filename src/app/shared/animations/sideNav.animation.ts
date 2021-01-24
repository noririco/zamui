import { trigger, state, style, transition, animate } from "@angular/animations";

export const onSideNavChange = 

    trigger('onSideNavChange', [
      state('close',
        style({
          width: '60px'
        })
      ),
      state('open',
        style({
          width: '250px'
        })
      ),
      transition('close => open', animate('250ms ease-in')),
      transition('open => close', animate('250ms ease-in')),

    ]);