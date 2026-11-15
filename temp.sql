SELECT     catch_returns.id,     bookings.date AS bookingDate,     catch_returns.created_at,     catch_returns.nil_return,  
   catch_returns.location_name,     catch_returns.comments,     catch_returns.user_id AS userId,     catch_returns.stats_total,   
     catch_returns.stats_large_fish,     catch_returns.stats_average_length,   
  TRIM(COALESCE(users.first_name, '') || ' ' || COALESCE(users.last_name, '')) AS userName   FROM catch_returns  
   INNER JOIN bookings ON bookings.id = catch_returns.booking_id   LEFT JOIN users ON users.id = catch_returns.user_id  
    WHERE catch_returns.return_completed = 1              
       AND DATE(bookings.date) >= DATE('2026-10-18')
         AND DATE(bookings.date) <= DATE('2026-11-01')     
 AND (catch_returns.nil_return = 0 OR catch_returns.comments <> '')  
       ORDER BY catch_returns.created_at DESC

       SELECT     locations.type AS LocationType,     COUNT(bookings_anglers.id) AS CountOfRods,    
        COALESCE(SUM(catch_returns.stats_total), 0) AS TotalCatches,   
          CAST(     ROUND(       sum(catch_returns.stats_average_length)       
            / count(catch_returns.id)     ,     0     ) AS INTEGER) AS AvgLength,    
             COALESCE(MAX(catch_returns.stats_large_fish), 0) AS MaxLargeFish  
              FROM bookings   INNER JOIN locations ON locations.id = bookings.location_id  
               INNER JOIN bookings_anglers ON bookings_anglers._parent_id = bookings.id  
                LEFT JOIN catch_returns ON catch_returns.booking_id = bookings.id  
                 AND catch_returns.return_completed = 1       
                   WHERE DATE(bookings.date) >= DATE('2026-10-18')   
                     AND DATE(bookings.date) <= DATE('2026-11-01')        GROUP BY locations.type