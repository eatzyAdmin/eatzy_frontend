const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const ts=require('typescript');
function load(file,http){
 const full=path.resolve(__dirname,'../packages/api/src',file);
 const mod=new Module(full);mod.filename=full;
 mod.require=id=>{if(id==='./http')return {http};throw new Error(id)};
 mod._compile(ts.transpileModule(fs.readFileSync(full,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,full);return mod.exports;
}
const {makeDriverKycSubmission,driverKycFields}=load('driver-kyc.ts');
test('revision patch preserves the approved base, exact draft version, null clears and zero',()=>{
 const p={kycRevisionState:{activeRevisionNumber:7,pendingRevision:{lockVersion:0}}};
 assert.deepEqual(makeDriverKycSubmission(p,{bank_branch:null,vehicle_year:2025}),{baseRevisionNumber:7,expectedVersion:0,documents:{bank_branch:null,vehicle_year:2025}});
 assert.equal(driverKycFields.length,27);assert.equal(new Set(driverKycFields).size,27);
});
test('new legacy revision sends base zero and no pending version',()=>{
 assert.deepEqual(makeDriverKycSubmission({kycRevisionState:{activeRevisionNumber:0,legacyApproved:true,pendingRevision:null}},{vehicle_brand:'Test'}),{baseRevisionNumber:0,expectedVersion:null,documents:{vehicle_brand:'Test'}});
});
test('missing state and operational-field injection fail before sending',()=>{
 assert.throws(()=>makeDriverKycSubmission({},{}),/Reload/);
 for(const field of ['user','codLimit','national_id_status','reservedOrderId','kycRevisionState'])assert.throws(()=>makeDriverKycSubmission({kycRevisionState:{}},{[field]:1}),/Unsupported/);
});
test('legacy PUT strips server-only KYC metadata without changing the envelope',async()=>{
 const envelope={statusCode:200,data:{id:5}};let sent;
 const api=load('driver.ts',{put:(url,body)=>{sent={url,body};return Promise.resolve(envelope)}}).driverApi;
 assert.equal(await api.updateDriverProfile({id:5,kycEligible:true,kycRevisionState:{activeRevisionNumber:1},vehicle_brand:'Test'}),envelope);
 assert.deepEqual(sent,{url:'/api/v1/driver-profiles',body:{id:5,vehicle_brand:'Test'}});
});
test('submit and review use exact versioned endpoints and retain response envelope',async()=>{
 const calls=[];const envelope={statusCode:200,data:{id:5}};
 const api=load('driver.ts',{post:(...args)=>{calls.push(args);return Promise.resolve(envelope)}}).driverApi;
 const body=makeDriverKycSubmission({kycRevisionState:{activeRevisionNumber:2,pendingRevision:{lockVersion:3}}},{vehicle_brand:'Test'});
 assert.equal(await api.submitKycRevision(5,body),envelope);
 assert.equal(await api.reviewKycRevision(5,9,3,'REJECT','Expired'),envelope);
 assert.deepEqual(calls,[['/api/v1/driver-profiles/5/kyc-revisions',body],['/api/v1/driver-profiles/5/kyc-revisions/9/review',{expectedVersion:3,decision:'REJECT',reason:'Expired'}]]);
});
test('private history and admin queue translate UI zero-based pages to one-based HTTP pages',async()=>{
 const calls=[];const api=load('driver.ts',{get:(...args)=>{calls.push(args);return Promise.resolve({statusCode:200})}}).driverApi;
 await api.getKycHistory(5,2);await api.getPendingKycRevisions();
 assert.deepEqual(calls,[['/api/v1/driver-profiles/5/kyc-revisions',{params:{page:3,size:10}}],['/api/v1/driver-kyc-revisions/pending',{params:{page:1,size:20}}]]);
});
