import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Search, Users, GraduationCap, Phone, School } from 'lucide-react';
import axios from 'axios';

interface Student {
  name: string;
  school: string;
  phone: string;
}

interface FormData {
  query: string;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const { register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      query: '',
    },
  });

  const watchedQuery = watch('query');

  const searchStudents = async (data: FormData) => {
    if (!data.query.trim()) {
      setError('검색어를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');
    setStudents([]);

    try {
      const response = await axios.get('http://localhost:8080/api/chat', {
        params: { question: data.query },
      });

      if (!response.data?.length) {
        setError('검색 결과가 없습니다.');
        setIsLoading(false);
        return;
      }

      // 데이터 유효성 검증
      const validStudents = response.data.filter((student: unknown) => {
        const typedStudent = student as Student;
        const { name, school, phone } = typedStudent;
        if (!name || !school || !phone) {
          console.warn('불완전한 학생 데이터:', student);
          return false;
        }
        return true;
      });

      setStudents(validStudents);
      setIsLoading(false);
    } catch (error: unknown) {
      console.error('Error:', error);
      let errorMessage = '알 수 없는 오류가 발생했습니다.';

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data
          ? `서버 오류 (${error.response.status}): ${error.response.data}`
          : `네트워크 오류: ${error.message}`;
      } else if (error instanceof Error) {
        errorMessage = `오류: ${error.message}`;
      }

      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(searchStudents)();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="min-h-screen flex flex-col">
        {/* 헤더 */}
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-2 bg-slate-900 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-light text-slate-900 tracking-wide">
                  Student ERP System
                </h1>
                <p className="text-sm text-slate-600 font-light tracking-wider uppercase">
                  Student Management Portal
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex-1 max-w-6xl mx-auto w-full p-6">
          {/* 검색 영역 */}
          <div className="mb-8">
            <form onSubmit={handleSubmit(searchStudents)}>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1 pr-[0.5rem]">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    {...register('query')}
                    onKeyPress={handleKeyPress}
                    placeholder="검색어를 입력하세요 (예: 전체 학생목록 알려줘)"
                    className="flex-1 px-5 py-3 bg-transparent text-slate-800 placeholder-slate-500 focus:outline-none font-light"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !watchedQuery?.trim()}
                    className="px-5 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed font-light shadow-sm transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* 결과 영역 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
            {/* 로딩 상태 */}
            {isLoading && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-slate-600 animate-pulse" />
                </div>
                <p className="text-slate-600 font-light">검색 중...</p>
              </div>
            )}

            {/* 에러 상태 */}
            {error && !isLoading && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-red-600 font-light">{error}</p>
              </div>
            )}

            {/* 초기 상태 */}
            {!isLoading && !error && students.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-xl font-light text-slate-900 mb-3">
                  학생 정보를 검색해보세요
                </h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  원하는 조건으로 학생 정보를 검색할 수 있습니다.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  <span className="px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-700 transition-colors duration-200">
                    전체 학생목록
                  </span>
                  <span className="px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-700 transition-colors duration-200">
                    특정 학교 학생
                  </span>
                  <span className="px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-700 transition-colors duration-200">
                    학생 이름 검색
                  </span>
                </div>
              </div>
            )}

            {/* 검색 결과 테이블 */}
            {!isLoading && !error && students.length > 0 && (
              <div className="overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-light text-slate-900">
                    검색 결과 ({students.length}명)
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="w-1/3 p-6 font-light text-slate-700 tracking-wide">
                          <div className="flex items-center justify-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>이름</span>
                          </div>
                        </th>
                        <th className="w-1/3 p-6 font-light text-slate-700 tracking-wide">
                          <div className="flex items-center justify-center space-x-2">
                            <School className="w-4 h-4" />
                            <span>학교</span>
                          </div>
                        </th>
                        <th className="w-1/3 p-6 font-light text-slate-700 tracking-wide">
                          <div className="flex items-center justify-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>전화번호</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, index) => (
                        <tr
                          key={index}
                          className="border-b border-slate-200 hover:bg-slate-50 transition-colors duration-200"
                        >
                          <td className="w-1/3 p-6 font-light text-slate-800 text-center">
                            {student.name}
                          </td>
                          <td className="w-1/3 p-6 font-light text-slate-600 text-center">
                            {student.school}
                          </td>
                          <td className="w-1/3 p-6 font-light text-slate-600 text-center">
                            {student.phone}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
