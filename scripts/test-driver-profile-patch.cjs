const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const Module=require('node:module');const ts=require('typescript');
const file=path.resolve(__dirname,'../packages/api/src/driver-kyc.ts');const mod=new Module(file);mod._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,file);
const {makeDriverProfilePatch:patch}=mod.exports;
test('unrelated admin edit never replays a stale trip count, rating or availability',()=>{
 const baseline={id:9,status:'AVAILABLE',completedTrips:5,averageRating:4.5,codLimit:1000,vehicle_brand:'Old'};
 // A delivery may have changed server trips/status while this form was open.
 assert.deepEqual(patch(baseline,{...baseline,codLimit:2000}),{id:9,codLimit:2000});
});
test('explicit numeric zero and changed operational values are retained',()=>{
 const baseline={id:9,status:'OFFLINE',completedTrips:5,averageRating:4.5,codLimit:1000};
 assert.deepEqual(patch(baseline,{...baseline,codLimit:0,completedTrips:0,averageRating:0,status:'AVAILABLE'}),{id:9,codLimit:0,completedTrips:0,averageRating:0,status:'AVAILABLE'});
});
test('profile identity, embedded owner and KYC read metadata cannot enter the edit patch',()=>{
 const baseline={id:9,status:'OFFLINE',user:{id:1},kycEligible:true,kycRevisionState:{activeRevisionNumber:2}};
 assert.deepEqual(patch(baseline,{...baseline,id:10,user:{id:2},kycEligible:false,kycRevisionState:{activeRevisionNumber:99}}),{id:9});
 assert.deepEqual(patch(baseline,{codLimit:undefined}),{id:9});
});
