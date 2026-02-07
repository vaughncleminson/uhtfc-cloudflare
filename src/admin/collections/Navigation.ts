import { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  fields: [
    {
      name: 'navigation',
      type: 'json',
      label: 'Navigation Structure',
      defaultValue: [
        {
          title: 'The Club',
          children: [
            {
              title: 'History',
              link: 'the-club/history',
            },
            {
              title: 'Rod Fees & Membership',
              link: 'the-club/rod-fees-membership',
            },
            {
              title: 'Club Rules & Bylaws',
              link: 'the-club/club-rules-bylaws',
            },
          ],
        },
        {
          title: 'Our Water',
          children: [
            {
              title: 'Stillwaters',
              link: 'our-water/stillwaters',
            },
            {
              title: 'Rivers',
              link: 'our-water/rivers',
            },
          ],
        },
        {
          title: 'News & Events',
          children: [
            {
              title: 'Festivals',
              children: [
                {
                  title: 'Rivers in May Festival',
                  link: 'news-and-events/festivals/rivers-in-may-festival',
                },
                {
                  title: 'Stillwater Festival',
                  link: 'news-and-events/festivals/stillwater-festival',
                },
              ],
            },
            {
              title: 'News',
              link: 'news-and-events/news',
            },
          ],
        },
        {
          title: 'Profile',
          children: [
            {
              title: 'Settings',
              link: 'profile/settings',
            },
            {
              title: 'Bookings',
              link: 'profile/bookings',
            },
            {
              title: 'Catch Returns',
              link: 'profile/catch-returns',
            },
            {
              title: 'Payment History',
              link: 'profile/payment-history',
            },
            {
              title: 'Logout',
              link: 'profile/logout',
            },
          ],
        },
      ],
    },
  ],
}
