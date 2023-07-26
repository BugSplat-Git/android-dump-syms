import { AndroidDumpSymsClient } from '../index';

describe('AndroidDumpSymsClient', () => {
    let sut: AndroidDumpSymsClient;
    
    let fakeClient
    let fakeFormData;
    let result;

    const fakeFile = 'fakeFile';
    const fakePath = 'fakePath';
    const fakeResult = 'fakeResult;'

    beforeEach(async () => {
        fakeClient = jasmine.createSpyObj('ApiClient', ['createFormData', 'fetch']);
        fakeFormData = jasmine.createSpyObj('FormData', ['append']);
        fakeClient.createFormData.and.returnValue(fakeFormData);
        fakeClient.fetch.and.resolveTo(fakeResult);
        sut = new (AndroidDumpSymsClient as any)(fakeClient);
        sut.readFile = jasmine.createSpy();
        (sut.readFile as jasmine.Spy).and.resolveTo(fakeFile);
        result = await sut.upload(fakePath);
    });

    describe('upload', () => {
        it('should fetch from correct endpoint', () => {
            expect(fakeClient.fetch).toHaveBeenCalledWith('/post/android/symbols', jasmine.any(Object));
        });

        it('should append file', () => {
            expect(fakeFormData.append).toHaveBeenCalledWith('file', jasmine.any(Blob), fakePath);
        });

        it('should return response', () => {
            expect(result).toBe(fakeResult);
        });
    });
});