#!/bin/bash
sed -n '1,400p' src/components/SuperAdmin.tsx > out_part1.txt
sed -n '479,584p' src/components/SuperAdmin.tsx > out_renewals.txt
sed -n '436,478p' src/components/SuperAdmin.tsx > out_topartists.txt
sed -n '401,435p' src/components/SuperAdmin.tsx > out_revenue.txt
sed -n '585,$p' src/components/SuperAdmin.tsx > out_part5.txt

cat out_part1.txt > src/components/SuperAdmin.tsx
cat out_renewals.txt >> src/components/SuperAdmin.tsx
cat out_topartists.txt >> src/components/SuperAdmin.tsx
cat out_revenue.txt >> src/components/SuperAdmin.tsx
cat out_part5.txt >> src/components/SuperAdmin.tsx
