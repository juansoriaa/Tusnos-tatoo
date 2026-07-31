function distribute(total, numBuckets) {
    let buckets = new Array(numBuckets).fill(0);
    for (let i = 0; i < total; i++) {
        // Randomly pick a bucket, maybe weighting towards the end (recent days)
        let r = Math.random();
        let bucketIndex = Math.floor(Math.pow(r, 0.5) * numBuckets);
        buckets[bucketIndex]++;
    }
    return buckets;
}
console.log(distribute(5, 7));
