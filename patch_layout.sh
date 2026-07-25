#!/bin/bash

# Extract parts
sed -n '1,399p' src/components/SuperAdmin.tsx > part1.txt

sed -n '473,546p' src/components/SuperAdmin.tsx > renewals.txt

sed -n '431,472p' src/components/SuperAdmin.tsx > top_artists_and_zone3.txt

sed -n '400,430p' src/components/SuperAdmin.tsx > revenue.txt

sed -n '547,$p' src/components/SuperAdmin.tsx > part5.txt

# Combine
cat part1.txt > src/components/SuperAdmin.tsx
cat renewals.txt >> src/components/SuperAdmin.tsx
cat top_artists_and_zone3.txt >> src/components/SuperAdmin.tsx
cat revenue.txt >> src/components/SuperAdmin.tsx
cat part5.txt >> src/components/SuperAdmin.tsx
