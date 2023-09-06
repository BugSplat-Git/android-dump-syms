import { AndroidDumpSymsClient } from '../index';

describe('AndroidDumpSymsClient', () => {
    let sut: AndroidDumpSymsClient;
    
    let fakeClient
    let fakeFormData;
    let result;

    const fakeHandle = { close: jasmine.createSpy() };
    const fakeFile = new File([], 'fakeFile');
    const fakePath = 'fakePath';
    const fakeResult = 'fakeResult;'

    beforeEach(async () => {
        fakeClient = jasmine.createSpyObj('ApiClient', ['createFormData', 'fetch']);
        fakeFormData = jasmine.createSpyObj('FormData', ['append']);
        fakeClient.createFormData.and.returnValue(fakeFormData);
        fakeClient.fetch.and.resolveTo(fakeResult);
        sut = new (AndroidDumpSymsClient as any)(fakeClient);
        (sut as any).open = jasmine.createSpy();
        (sut as any).createStreamableFile = jasmine.createSpy();
        ((sut as any).open as jasmine.Spy).and.resolveTo(fakeHandle);
        ((sut as any).createStreamableFile as jasmine.Spy).and.resolveTo(fakeFile);
        result = await sut.upload(fakePath);
    });

    describe('upload', () => {
        it('should fetch from correct endpoint', () => {
            expect(fakeClient.fetch).toHaveBeenCalledWith('/post/android/symbols', jasmine.any(Object));
        });

        it('should call createStreamableFile with name and handle', () => {
            expect((sut as any).createStreamableFile).toHaveBeenCalledWith(fakePath, fakeHandle);
        });

        it('should append file', () => {
            expect(fakeFormData.append).toHaveBeenCalledWith('file', fakeFile, fakePath);
        });

        it('should return response', () => {
            expect(result).toBe(fakeResult);
        });

        it('should close file handle', () => {
            expect(fakeHandle.close).toHaveBeenCalled();
        });
    });
});