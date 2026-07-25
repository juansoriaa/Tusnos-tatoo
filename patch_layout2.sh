#!/bin/bash
sed -n '1,398p' src/components/SuperAdmin.tsx > part1.txt
sed -n '559,$p' src/components/SuperAdmin.tsx > part5.txt

cat part1.txt > src/components/SuperAdmin.tsx
cat renewals.txt >> src/components/SuperAdmin.tsx
cat top_artists.txt >> src/components/SuperAdmin.tsx
echo '          </section>' >> src/components/SuperAdmin.tsx
echo '          {/* Zone 3: Revenue & Settings */}' >> src/components/SuperAdmin.tsx
echo '          <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">' >> src/components/SuperAdmin.tsx
cat revenue.txt >> src/components/SuperAdmin.tsx
cat part5.txt >> src/components/SuperAdmin.tsx
